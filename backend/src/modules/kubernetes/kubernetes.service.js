const k8s = require('@kubernetes/client-node');
const { AppError } = require('../../shared/errors/AppError');

// Initialize KubeConfig
const kc = new k8s.KubeConfig();
try {
  kc.loadFromDefault();
} catch (e) {
  console.warn('Kubernetes config could not be loaded from default location. K8s APIs may fail.', e.message);
}

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
const k8sEventsApi = kc.makeApiClient(k8s.EventsV1Api);

async function listPods(namespace = 'default') {
  try {
    const res = await k8sApi.listNamespacedPod({ namespace });
    return res.items.map(pod => ({
      name: pod.metadata.name,
      namespace: pod.metadata.namespace,
      status: pod.status.phase,
      nodeName: pod.spec.nodeName,
      createdAt: pod.metadata.creationTimestamp,
      restarts: pod.status.containerStatuses ? pod.status.containerStatuses.reduce((acc, c) => acc + c.restartCount, 0) : 0,
    }));
  } catch (error) {
    throw new AppError(`Failed to list pods: ${error.message}`, 500);
  }
}

async function listDeployments(namespace = 'default') {
  try {
    const res = await k8sAppsApi.listNamespacedDeployment({ namespace });
    return res.items.map(dep => ({
      name: dep.metadata.name,
      namespace: dep.metadata.namespace,
      replicas: dep.spec.replicas,
      availableReplicas: dep.status.availableReplicas || 0,
      createdAt: dep.metadata.creationTimestamp,
      conditions: dep.status.conditions || []
    }));
  } catch (error) {
    throw new AppError(`Failed to list deployments: ${error.message}`, 500);
  }
}

async function listServices(namespace = 'default') {
  try {
    const res = await k8sApi.listNamespacedService({ namespace });
    return res.items.map(svc => ({
      name: svc.metadata.name,
      namespace: svc.metadata.namespace,
      type: svc.spec.type,
      clusterIP: svc.spec.clusterIP,
      ports: svc.spec.ports,
      createdAt: svc.metadata.creationTimestamp
    }));
  } catch (error) {
    throw new AppError(`Failed to list services: ${error.message}`, 500);
  }
}

async function listNamespaces() {
  try {
    const res = await k8sApi.listNamespace();
    return res.items.map(ns => ({
      name: ns.metadata.name,
      status: ns.status.phase,
      createdAt: ns.metadata.creationTimestamp
    }));
  } catch (error) {
    throw new AppError(`Failed to list namespaces: ${error.message}`, 500);
  }
}

async function scaleDeployment(namespace, name, replicas) {
  try {
    // We need to patch the scale
    const res = await k8sAppsApi.patchNamespacedDeploymentScale({
      name, 
      namespace, 
      body: { spec: { replicas: parseInt(replicas, 10) } },
      options: { headers: { "content-type": "application/merge-patch+json" } }
    });
    return { message: `Deployment ${name} scaled to ${replicas}`, data: res };
  } catch (error) {
    throw new AppError(`Failed to scale deployment: ${error.message}`, 500);
  }
}

async function restartDeployment(namespace, name) {
  try {
    // To restart a deployment, we patch it with a new annotation containing the current timestamp
    const patch = {
      spec: {
        template: {
          metadata: {
            annotations: {
              "kubectl.kubernetes.io/restartedAt": new Date().toISOString()
            }
          }
        }
      }
    };
    const res = await k8sAppsApi.patchNamespacedDeployment({
      name,
      namespace,
      body: patch,
      options: { headers: { "content-type": "application/merge-patch+json" } }
    });
    return { message: `Deployment ${name} restarted`, data: res };
  } catch (error) {
    throw new AppError(`Failed to restart deployment: ${error.message}`, 500);
  }
}

async function deleteDeployment(namespace, name) {
  try {
    await k8sAppsApi.deleteNamespacedDeployment({ name, namespace });
    return { message: `Deployment ${name} deleted` };
  } catch (error) {
    throw new AppError(`Failed to delete deployment: ${error.message}`, 500);
  }
}

async function deployApp(namespace, name, image, replicas = 1, port = 80) {
  try {
    const deployment = {
      metadata: { name },
      spec: {
        replicas: parseInt(replicas, 10),
        selector: { matchLabels: { app: name } },
        template: {
          metadata: { labels: { app: name } },
          spec: {
            containers: [{
              name,
              image,
              ports: [{ containerPort: parseInt(port, 10) }]
            }]
          }
        }
      }
    };
    
    await k8sAppsApi.createNamespacedDeployment({ namespace, body: deployment });
    return { message: `App ${name} deployed successfully` };
  } catch (error) {
    throw new AppError(`Failed to deploy app: ${error.message}`, 500);
  }
}

module.exports = {
  listPods,
  listDeployments,
  listServices,
  listNamespaces,
  scaleDeployment,
  restartDeployment,
  deleteDeployment,
  deployApp
};
