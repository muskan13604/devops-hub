const k8sService = require('./kubernetes.service');

async function listPods(req, res, next) {
  try {
    const { namespace } = req.query;
    const result = await k8sService.listPods(namespace);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function listDeployments(req, res, next) {
  try {
    const { namespace } = req.query;
    const result = await k8sService.listDeployments(namespace);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function listServices(req, res, next) {
  try {
    const { namespace } = req.query;
    const result = await k8sService.listServices(namespace);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function listNamespaces(req, res, next) {
  try {
    const result = await k8sService.listNamespaces();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function deployApp(req, res, next) {
  try {
    const { namespace = 'default', name, image, replicas, port } = req.body;
    const result = await k8sService.deployApp(namespace, name, image, replicas, port);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function scaleDeployment(req, res, next) {
  try {
    const { namespace = 'default', name, replicas } = req.body;
    const result = await k8sService.scaleDeployment(namespace, name, replicas);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function restartDeployment(req, res, next) {
  try {
    const { namespace = 'default', name } = req.body;
    const result = await k8sService.restartDeployment(namespace, name);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function deleteDeployment(req, res, next) {
  try {
    const { namespace = 'default', name } = req.body;
    const result = await k8sService.deleteDeployment(namespace, name);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listPods,
  listDeployments,
  listServices,
  listNamespaces,
  deployApp,
  scaleDeployment,
  restartDeployment,
  deleteDeployment
};
