const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const githubController = require('../../modules/github/github.controller');

const router = Router();

router.use(authenticate);

router.post('/token', githubController.saveToken);
router.get('/repositories', githubController.getRepositories);
router.get('/branches', githubController.getBranches);
router.get('/commits', githubController.getCommits);

module.exports = router;
