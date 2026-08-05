const { AppError } = require('../../shared/errors/AppError');
const { getDatabase } = require('../../database/mongoClient');
const { ObjectId } = require('mongodb');
const { broadcastNotification } = require('../../socket');

const usersCollection = () => getDatabase().collection('users');
const jenkinsHistoryCollection = () => getDatabase().collection('jenkinsHistory');

async function saveJenkinsConfig(userId, url, username, token) {
  if (!url || !username || !token) {
    throw new AppError('Jenkins URL, username, and token are required', 400, 'VALIDATION_ERROR');
  }
  await usersCollection().updateOne(
    { _id: new ObjectId(userId) },
    { $set: { jenkinsConfig: { url, username, token } } }
  );
  return { message: 'Jenkins config saved successfully' };
}

async function getJenkinsConfig(userId) {
  const user = await usersCollection().findOne({ _id: new ObjectId(userId) });
  if (!user || !user.jenkinsConfig) {
    throw new AppError('Jenkins configuration not found. Please connect your Jenkins account.', 400, 'JENKINS_NOT_CONNECTED');
  }
  return user.jenkinsConfig;
}

function getJenkinsHeaders(config) {
  const credentials = Buffer.from(`${config.username}:${config.token}`).toString('base64');
  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  };
}

async function triggerBuild(userId, jobName, parameters = {}) {
  const config = await getJenkinsConfig(userId);
  const headers = getJenkinsHeaders(config);
  
  // 1. Fetch CSRF Crumb (required by default in modern Jenkins for POST requests)
  let crumbHeaders = {};
  try {
    const crumbRes = await fetch(`${config.url}/crumbIssuer/api/json`, { headers });
    if (crumbRes.ok) {
      const crumbData = await crumbRes.json();
      crumbHeaders[crumbData.crumbRequestField] = crumbData.crumb;
    }
  } catch (err) {
    console.warn('Could not fetch Jenkins crumb. Proceeding without it...', err.message);
  }

  const finalHeaders = { ...headers, ...crumbHeaders };
  
  // 2. Trigger the build
  // Jenkins URL usually ends with /job/JOB_NAME/build (or buildWithParameters)
  const isParameterized = Object.keys(parameters).length > 0;
  const endpoint = isParameterized ? 'buildWithParameters' : 'build';
  
  // Convert parameters to URL search params
  const qs = isParameterized ? '?' + new URLSearchParams(parameters).toString() : '';
  const url = `${config.url}/job/${jobName}/${endpoint}${qs}`;
  
  const response = await fetch(url, { method: 'POST', headers: finalHeaders });
  
  if (!response.ok && response.status !== 201) {
    throw new AppError(`Failed to trigger Jenkins build for job ${jobName} (Status ${response.status})`, response.status, 'JENKINS_ERROR');
  }

  // 3. We save the build attempt in local history to track what was triggered from DevOpsHub
  const history = {
    userId: new ObjectId(userId),
    jobName,
    parameters,
    triggeredAt: new Date(),
    status: 'TRIGGERED'
  };
  const result = await jenkinsHistoryCollection().insertOne(history);
  
  broadcastNotification('Jenkins Build Triggered', `Job ${jobName} has been queued.`, 'info');
  
  return { message: `Build triggered for ${jobName}`, historyId: result.insertedId };
}

async function getBuildStatus(userId, jobName, buildId) {
  const config = await getJenkinsConfig(userId);
  const headers = getJenkinsHeaders(config);
  
  const url = `${config.url}/job/${jobName}/${buildId}/api/json`;
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new AppError(`Failed to get status for ${jobName}#${buildId}`, response.status, 'JENKINS_ERROR');
  }
  
  const data = await response.json();
  return {
    building: data.building,
    result: data.result, // SUCCESS, FAILURE, ABORTED, etc.
    duration: data.duration,
    timestamp: data.timestamp
  };
}

async function getBuildLogs(userId, jobName, buildId) {
  const config = await getJenkinsConfig(userId);
  const headers = getJenkinsHeaders(config);
  
  const url = `${config.url}/job/${jobName}/${buildId}/consoleText`;
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new AppError(`Failed to fetch logs for ${jobName}#${buildId}`, response.status, 'JENKINS_ERROR');
  }
  
  const logs = await response.text();
  return { logs };
}

async function getPipelineStages(userId, jobName, buildId) {
  const config = await getJenkinsConfig(userId);
  const headers = getJenkinsHeaders(config);
  
  // Jenkins workflow API endpoint for pipeline stages
  const url = `${config.url}/job/${jobName}/${buildId}/wfapi/describe`;
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`wfapi returned ${response.status}`);
    }
    const data = await response.json();
    return data.stages || [];
  } catch (error) {
    console.warn(`Could not fetch pipeline stages for ${jobName}#${buildId}. (Maybe it is not a pipeline job?)`, error.message);
    return []; // Return empty if not a pipeline job or wfapi is missing
  }
}

async function getHistory(userId) {
  // 1. Get config (will throw JENKINS_NOT_CONNECTED if not configured, which triggers the UI modal)
  const config = await getJenkinsConfig(userId);
  const headers = getJenkinsHeaders(config);

  // 2. Fetch all jobs and their last build info from the real Jenkins instance
  const url = `${config.url}/api/json?tree=jobs[name,color,lastBuild[number,result,timestamp,actions[parameters[name,value]]]]`;
  
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Jenkins API returned status ${response.status}`);
    }
    const data = await response.json();
    
    if (!data.jobs) return [];

    // 3. Map the Jenkins data to the format the frontend expects
    const history = data.jobs
      .filter(job => job.lastBuild) // Only show jobs that have been built at least once
      .map(job => {
        // Extract parameters from the actions array
        let params = {};
        if (job.lastBuild.actions) {
          const paramsAction = job.lastBuild.actions.find(a => a._class && a._class.includes('ParametersAction'));
          if (paramsAction && paramsAction.parameters) {
            paramsAction.parameters.forEach(p => {
              params[p.name] = p.value;
            });
          }
        }

        // Determine status
        let status = 'UNKNOWN';
        if (job.color && job.color.includes('anime')) {
          status = 'TRIGGERED'; // It's currently running
        } else if (job.lastBuild.result === 'SUCCESS') {
          status = 'SUCCESS';
        } else if (job.lastBuild.result === 'FAILURE') {
          status = 'FAILURE';
        } else if (job.lastBuild.result === 'ABORTED') {
          status = 'ABORTED';
        }

        return {
          jobName: job.name,
          buildNumber: job.lastBuild.number,
          status: status,
          parameters: params,
          triggeredAt: new Date(job.lastBuild.timestamp).toISOString()
        };
      })
      .sort((a, b) => new Date(b.triggeredAt) - new Date(a.triggeredAt)); // Sort newest first
      
    return history;
  } catch (err) {
    throw new AppError(`Failed to fetch history from Jenkins: ${err.message}`, 500, 'JENKINS_ERROR');
  }
}

module.exports = {
  saveJenkinsConfig,
  triggerBuild,
  getBuildStatus,
  getBuildLogs,
  getPipelineStages,
  getHistory
};
