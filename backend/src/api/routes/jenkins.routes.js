const express = require('express');
const router = express.Router();
const jenkinsController = require('../../modules/jenkins/jenkins.controller');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.use(authenticate);

router.post('/config', jenkinsController.saveConfig);
router.get('/history', jenkinsController.getHistory);

// Only Admins and Developers can trigger builds
router.post('/trigger', authorize('Admin', 'Developer'), jenkinsController.triggerBuild);

router.get('/:jobName/:buildId/status', jenkinsController.getBuildStatus);
router.get('/:jobName/:buildId/logs', jenkinsController.getBuildLogs);
router.get('/:jobName/:buildId/stages', jenkinsController.getPipelineStages);

module.exports = router;
