const { AppError } = require('../../shared/errors/AppError');
const { getDatabase } = require('../../database/mongoClient');
const { ObjectId } = require('mongodb');

// We'll store the githubToken securely in the user document for this implementation
const usersCollection = () => getDatabase().collection('users');

async function saveGitHubToken(userId, token) {
  if (!token) throw new AppError('GitHub token is required', 400, 'VALIDATION_ERROR');
  await usersCollection().updateOne(
    { _id: new ObjectId(userId) },
    { $set: { githubToken: token } }
  );
  return { message: 'GitHub token saved successfully' };
}

async function getGitHubHeaders(userId) {
  const user = await usersCollection().findOne({ _id: new ObjectId(userId) });
  if (!user || !user.githubToken) {
    throw new AppError('GitHub token not found. Please connect your GitHub account.', 400, 'GITHUB_NOT_CONNECTED');
  }
  return {
    Authorization: `Bearer ${user.githubToken}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'DevOpsHub-AI'
  };
}

async function fetchRepositories(userId) {
  const headers = await getGitHubHeaders(userId);
  // Fetching user's own repos and repos they have access to
  const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', { headers });
  if (!response.ok) {
    throw new AppError('Failed to fetch repositories from GitHub', response.status, 'GITHUB_ERROR');
  }
  const repos = await response.json();
  return repos.map(repo => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    htmlUrl: repo.html_url,
    description: repo.description,
    stars: repo.stargazers_count,
    language: repo.language,
    updatedAt: repo.updated_at
  }));
}

async function fetchBranches(userId, repoFullName) {
  const headers = await getGitHubHeaders(userId);
  const response = await fetch(`https://api.github.com/repos/${repoFullName}/branches`, { headers });
  if (!response.ok) {
    throw new AppError('Failed to fetch branches from GitHub', response.status, 'GITHUB_ERROR');
  }
  return response.json();
}

async function fetchLatestCommits(userId, repoFullName, branch = 'main') {
  const headers = await getGitHubHeaders(userId);
  const response = await fetch(`https://api.github.com/repos/${repoFullName}/commits?sha=${branch}&per_page=5`, { headers });
  if (!response.ok) {
    throw new AppError('Failed to fetch commits from GitHub', response.status, 'GITHUB_ERROR');
  }
  const commits = await response.json();
  return commits.map(commit => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author.name,
    date: commit.commit.author.date,
    url: commit.html_url
  }));
}

module.exports = {
  saveGitHubToken,
  fetchRepositories,
  fetchBranches,
  fetchLatestCommits
};
