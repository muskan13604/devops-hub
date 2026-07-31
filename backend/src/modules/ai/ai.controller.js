const aiService = require('./ai.service');

async function chat(req, res, next) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });
    
    const reply = await aiService.chat(message);
    res.json({ success: true, data: { reply } });
  } catch (error) {
    next(error);
  }
}

async function analyzeLogs(req, res, next) {
  try {
    const { logs } = req.body;
    if (!logs) return res.status(400).json({ success: false, message: 'Logs are required' });
    
    const analysis = await aiService.analyzeLogs(logs);
    res.json({ success: true, data: analysis });
  } catch (error) {
    next(error);
  }
}

async function generateDockerfile(req, res, next) {
  try {
    const { projectType } = req.body;
    if (!projectType) return res.status(400).json({ success: false, message: 'Project type is required' });
    
    const dockerfile = await aiService.generateDockerfile(projectType);
    res.json({ success: true, data: { dockerfile } });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  chat,
  analyzeLogs,
  generateDockerfile
};
