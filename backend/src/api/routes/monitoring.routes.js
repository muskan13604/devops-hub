const express = require('express');
const router = express.Router();
const monitoringController = require('../../modules/monitoring/monitoring.controller');
const { authorize } = require('../middlewares/authorize');
const { authenticate } = require('../middlewares/authenticate');

// Protect Monitoring APIs to all authenticated users
router.use(authenticate, authorize('Admin', 'Developer', 'Viewer'));

router.get('/metrics', monitoringController.getDashboardMetrics);

module.exports = router;
