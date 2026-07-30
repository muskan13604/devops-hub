const githubService = require('./github.service');
const { asyncHandler } = require('../../shared/utils/asyncHandler');

const saveToken = asyncHandler(async (req, res) => {
  const result = await githubService.saveGitHubToken(req.user._id, req.body.token);
  res.json({ data: result });
});

const getRepositories = asyncHandler(async (req, res) => {
  const repos = await githubService.fetchRepositories(req.user._id);
  res.json({ data: repos });
});

const getBranches = asyncHandler(async (req, res) => {
  const branches = await githubService.fetchBranches(req.user._id, req.query.repo);
  res.json({ data: branches });
});

const getCommits = asyncHandler(async (req, res) => {
  const commits = await githubService.fetchLatestCommits(req.user._id, req.query.repo, req.query.branch);
  res.json({ data: commits });
});

module.exports = { saveToken, getRepositories, getBranches, getCommits };
