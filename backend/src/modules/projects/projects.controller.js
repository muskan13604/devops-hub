const projectsService = require('./projects.service');
const { validateProjectData } = require('./projects.validator');
const { asyncHandler } = require('../../shared/utils/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const data = validateProjectData(req.body);
  const project = await projectsService.createProject(data, req.user._id);
  res.status(201).json({ data: project });
});

const list = asyncHandler(async (req, res) => {
  const result = await projectsService.getProjects(req.query);
  res.json(result);
});

const get = asyncHandler(async (req, res) => {
  const project = await projectsService.getProjectById(req.params.id);
  res.json({ data: project });
});

const update = asyncHandler(async (req, res) => {
  const data = validateProjectData(req.body);
  const project = await projectsService.updateProject(req.params.id, data);
  res.json({ data: project });
});

const remove = asyncHandler(async (req, res) => {
  await projectsService.deleteProject(req.params.id);
  res.status(204).send();
});

module.exports = { create, list, get, update, remove };
