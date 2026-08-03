const express = require('express');
const router = express.Router();
const dockerController = require('../../modules/docker/docker.controller');
const { authorize } = require('../middlewares/authorize');
const { authenticate } = require('../middlewares/authenticate');

// Protect Docker APIs to Admins and Developers
router.use(authenticate, authorize('Admin', 'Developer'));

router.get('/images', dockerController.listImages);
router.post('/images/pull', dockerController.pullImage);
router.post('/images/build', dockerController.buildImage);
router.post('/images/push', dockerController.pushImage);
router.delete('/images/:imageId', dockerController.deleteImage);

module.exports = router;
