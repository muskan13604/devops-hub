const express = require('express');
const router = express.Router();
const aiController = require('../../modules/ai/ai.controller');
const { authorize } = require('../middlewares/authorize');

const { authenticate } = require('../middlewares/authenticate');

// Protect AI APIs to all authenticated users
router.use(authenticate, authorize('Admin', 'Developer', 'Viewer'));

router.post('/chat', aiController.chat);
router.post('/analyze-logs', aiController.analyzeLogs);
router.post('/generate-dockerfile', aiController.generateDockerfile);

module.exports = router;
