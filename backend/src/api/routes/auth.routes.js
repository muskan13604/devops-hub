const { Router } = require('express');
const controller = require('../../modules/auth/auth.controller');
const { authenticate } = require('../middlewares/authenticate');

const router = Router();
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);

module.exports = router;
