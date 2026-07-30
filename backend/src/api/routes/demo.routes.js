const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

const router = Router();

// Protect all routes in this file
router.use(authenticate);

router.get('/public-info', (req, res) => {
  res.json({ message: 'Any authenticated user (Admin, Developer, Viewer) can see this.', user: req.user.email });
});

router.get('/dev-dashboard', authorize('Admin', 'Developer'), (req, res) => {
  res.json({ message: 'Only Admins and Developers can see this.', role: req.user.role });
});

router.get('/admin-panel', authorize('Admin'), (req, res) => {
  res.json({ message: 'Welcome Admin! You have full access.', role: req.user.role });
});

module.exports = router;
