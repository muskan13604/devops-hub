const { AppError } = require('../../shared/errors/AppError');

function validateProjectData(payload = {}) {
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const repository = typeof payload.repository === 'string' ? payload.repository.trim() : '';
  const description = typeof payload.description === 'string' ? payload.description.trim() : '';
  const status = ['Active', 'Archived'].includes(payload.status) ? payload.status : 'Active';
  const repoData = typeof payload.repoData === 'object' && payload.repoData !== null ? payload.repoData : null;

  if (!name) throw new AppError('Project name is required.', 400, 'VALIDATION_ERROR');
  if (!repository) throw new AppError('Repository (e.g., owner/repo) is required.', 400, 'VALIDATION_ERROR');

  return { name, repository, description, status, repoData };
}

module.exports = { validateProjectData };
