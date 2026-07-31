const jenkinsService = require('./jenkins.service');

async function saveConfig(req, res, next) {
  try {
    const { url, username, token } = req.body;
    const result = await jenkinsService.saveJenkinsConfig(req.user._id, url, username, token);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function triggerBuild(req, res, next) {
  try {
    const { jobName, parameters } = req.body;
    const result = await jenkinsService.triggerBuild(req.user._id, jobName, parameters);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getBuildStatus(req, res, next) {
  try {
    const { jobName, buildId } = req.params;
    const result = await jenkinsService.getBuildStatus(req.user._id, jobName, buildId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getBuildLogs(req, res, next) {
  try {
    const { jobName, buildId } = req.params;
    const result = await jenkinsService.getBuildLogs(req.user._id, jobName, buildId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getPipelineStages(req, res, next) {
  try {
    const { jobName, buildId } = req.params;
    const result = await jenkinsService.getPipelineStages(req.user._id, jobName, buildId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const result = await jenkinsService.getHistory(req.user._id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  saveConfig,
  triggerBuild,
  getBuildStatus,
  getBuildLogs,
  getPipelineStages,
  getHistory
};
