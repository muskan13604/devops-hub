const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const demoRoutes = require('./demo.routes');
const projectsRoutes = require('./projects.routes');
const githubRoutes = require('./github.routes');

const router = Router();
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/demo', demoRoutes);
router.use('/projects', projectsRoutes);
router.use('/github', githubRoutes);

module.exports = router;
