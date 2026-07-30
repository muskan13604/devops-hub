const { AppError } = require('../../shared/errors/AppError');
const repository = require('./projects.repository');

const presentProject = (project) => ({
  id: project._id.toString(),
  name: project.name,
  repository: project.repository,
  description: project.description,
  status: project.status,
  createdBy: project.createdBy.toString(),
  createdAt: project.createdAt,
  updatedAt: project.updatedAt
});

async function createProject(data, userId) {
  const result = await repository.createProject({ ...data, createdBy: userId });
  const project = await repository.getProjectById(result.insertedId);
  return presentProject(project);
}

async function getProjects(query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const { total, projects } = await repository.getProjects(query, skip, limit);
  return {
    data: projects.map(presentProject),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

async function getProjectById(id) {
  const project = await repository.getProjectById(id);
  if (!project) throw new AppError('Project not found', 404, 'NOT_FOUND');
  return presentProject(project);
}

async function updateProject(id, data) {
  const project = await repository.updateProject(id, data);
  if (!project) throw new AppError('Project not found', 404, 'NOT_FOUND');
  return presentProject(project);
}

async function deleteProject(id) {
  const result = await repository.deleteProject(id);
  if (result.deletedCount === 0) throw new AppError('Project not found', 404, 'NOT_FOUND');
  return true;
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
