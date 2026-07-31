const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const demoRoutes = require('./demo.routes');
const projectsRoutes = require('./projects.routes');
const githubRoutes = require('./github.routes');
const dockerRoutes = require('./docker.routes');
const jenkinsRoutes = require('./jenkins.routes');
const kubernetesRoutes = require('./kubernetes.routes');
const monitoringRoutes = require('./monitoring.routes');

const router = Router();
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/demo', demoRoutes);
router.use('/projects', projectsRoutes);
router.use('/github', githubRoutes);
router.use('/docker', dockerRoutes);
router.use('/jenkins', jenkinsRoutes);
router.use('/kubernetes', kubernetesRoutes);
router.use('/monitoring', monitoringRoutes);

module.exports = router;
