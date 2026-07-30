const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const demoRoutes = require('./demo.routes');

const router = Router();
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/demo', demoRoutes);

module.exports = router;
