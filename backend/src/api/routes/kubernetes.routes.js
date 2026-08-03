const express = require('express');
const router = express.Router();
const k8sController = require('../../modules/kubernetes/kubernetes.controller');
const { authorize } = require('../middlewares/authorize');

const { authenticate } = require('../middlewares/authenticate');

// Protect Kubernetes APIs to Admins, Developers, and Viewers
router.use(authenticate, authorize('Admin', 'Developer', 'Viewer'));

router.get('/pods', k8sController.listPods);
router.get('/deployments', k8sController.listDeployments);
router.get('/services', k8sController.listServices);
router.get('/namespaces', k8sController.listNamespaces);

router.post('/deployments/deploy', k8sController.deployApp);
router.post('/deployments/scale', k8sController.scaleDeployment);
router.post('/deployments/restart', k8sController.restartDeployment);
router.delete('/deployments/delete', k8sController.deleteDeployment);

module.exports = router;
