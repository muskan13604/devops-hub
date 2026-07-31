const express = require('express');
const router = express.Router();
const monitoringController = require('../../modules/monitoring/monitoring.controller');
const { authorize } = require('../middlewares/auth.middleware');

// Protect monitoring APIs
router.use(authorize('Admin', 'Developer', 'Viewer'));

router.get('/metrics', monitoringController.getDashboardMetrics);

module.exports = router;
