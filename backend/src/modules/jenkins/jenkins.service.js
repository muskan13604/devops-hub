const { AppError } = require('../../shared/errors/AppError');
const { getDatabase } = require('../../database/mongoClient');
const { ObjectId } = require('mongodb');

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
  
  // Jenkins URL usually ends with /job/JOB_NAME/build (or buildWithParameters)
  const isParameterized = Object.keys(parameters).length > 0;
  const endpoint = isParameterized ? 'buildWithParameters' : 'build';
  
  // Convert parameters to URL search params
  const qs = isParameterized ? '?' + new URLSearchParams(parameters).toString() : '';
  const url = `${config.url}/job/${jobName}/${endpoint}${qs}`;
  
  const response = await fetch(url, { method: 'POST', headers });
  if (!response.ok && response.status !== 201) {
    throw new AppError(`Failed to trigger Jenkins build for job ${jobName}`, response.status, 'JENKINS_ERROR');
  }

  // We save the build attempt in history
  const history = {
    userId: new ObjectId(userId),
    jobName,
    parameters,
    triggeredAt: new Date(),
    status: 'TRIGGERED'
  };
  const result = await jenkinsHistoryCollection().insertOne(history);
  
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

async function getHistory(userId) {
  const history = await jenkinsHistoryCollection()
    .find({ userId: new ObjectId(userId) })
    .sort({ triggeredAt: -1 })
    .limit(50)
    .toArray();
  return history;
}

module.exports = {
  saveJenkinsConfig,
  triggerBuild,
  getBuildStatus,
  getBuildLogs,
  getHistory
};
