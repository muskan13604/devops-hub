const { ObjectId } = require('mongodb');
const { getDatabase } = require('../../database/mongoClient');

const projectsCollection = () => getDatabase().collection('projects');

const createProject = async (projectData) => {
  const result = await projectsCollection().insertOne({
    ...projectData,
    createdBy: new ObjectId(projectData.createdBy),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
};

const getProjects = async (query = {}, skip = 0, limit = 10) => {
  const filter = {};
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }
  
  const total = await projectsCollection().countDocuments(filter);
  const projects = await projectsCollection()
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
    
  return { total, projects };
};

const getProjectById = async (id) => {
  return projectsCollection().findOne({ _id: new ObjectId(id) });
};

const updateProject = async (id, updateData) => {
  const result = await projectsCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result;
};

const deleteProject = async (id) => {
  return projectsCollection().deleteOne({ _id: new ObjectId(id) });
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
