const Graph = require('../../shared/data-structures/Graph');
const PriorityQueue = require('../../shared/data-structures/PriorityQueue');

class DeploymentScheduler {
  constructor() {
    this.dependencyGraph = new Graph();
    
    // Priority Queue: Custom comparator where higher priority value executes first.
    // E.g., 'production' = 100, 'staging' = 50, 'dev' = 10
    this.deploymentQueue = new PriorityQueue((a, b) => a.priority > b.priority);
  }

  /**
   * Defines a dependency where `dependentProject` relies on `baseProject`.
   * @param {string} baseProject - The project that must be deployed first.
   * @param {string} dependentProject - The project that depends on baseProject.
   */
  addDependency(baseProject, dependentProject) {
    // Add directed edge: dependentProject depends on baseProject
    // But for topological sort, we want an edge baseProject -> dependentProject 
    // to mean baseProject must precede dependentProject
    this.dependencyGraph.addEdge(baseProject, dependentProject);
  }

  /**
   * Calculates the ordered list of deployments based on dependencies.
   * @returns {Array<string>} An array of project names in deployment order.
   */
  getDependencyOrder() {
    return this.dependencyGraph.topologicalSort();
  }

  /**
   * Submits a deployment job to the queue.
   * @param {Object} job - The deployment job object.
   * @param {string} job.id - Job ID.
   * @param {string} job.project - Project name.
   * @param {string} job.environment - 'production', 'staging', 'dev', etc.
   */
  scheduleDeployment(job) {
    const priority = this._getPriority(job.environment);
    this.deploymentQueue.enqueue({ ...job, priority });
  }

  /**
   * Retrieves the next deployment job to execute based on priority.
   * @returns {Object|null} The highest priority job, or null if empty.
   */
  getNextDeployment() {
    return this.deploymentQueue.dequeue();
  }

  _getPriority(environment) {
    switch (environment.toLowerCase()) {
      case 'production':
      case 'prod':
        return 100;
      case 'staging':
        return 50;
      case 'development':
      case 'dev':
        return 10;
      default:
        return 0; // Lowest priority
    }
  }
}

module.exports = new DeploymentScheduler();
