const DeploymentScheduler = require('../src/modules/kubernetes/scheduler');
const AutocompleteService = require('../src/modules/api/autocomplete');
const JenkinsCacheService = require('../src/modules/jenkins/cache');

async function verify() {
  console.log('--- Verifying Graph & PriorityQueue via Scheduler ---');
  // Define dependencies: frontend depends on backend, backend depends on database
  DeploymentScheduler.addDependency('database', 'backend');
  DeploymentScheduler.addDependency('backend', 'frontend');
  
  const order = DeploymentScheduler.getDependencyOrder();
  console.log('Dependency Order (Topological Sort):', order); 
  // Expected: [ 'database', 'backend', 'frontend' ]

  // Queue deployments with different priorities
  DeploymentScheduler.scheduleDeployment({ id: 1, project: 'frontend', environment: 'dev' }); // priority 10
  DeploymentScheduler.scheduleDeployment({ id: 2, project: 'backend', environment: 'production' }); // priority 100
  DeploymentScheduler.scheduleDeployment({ id: 3, project: 'database', environment: 'staging' }); // priority 50

  console.log('\nScheduling Order:');
  console.log('1.', DeploymentScheduler.getNextDeployment().project, '(Expected: backend - prod)');
  console.log('2.', DeploymentScheduler.getNextDeployment().project, '(Expected: database - staging)');
  console.log('3.', DeploymentScheduler.getNextDeployment().project, '(Expected: frontend - dev)');


  console.log('\n--- Verifying Trie via Autocomplete ---');
  console.log('docker p... =>', AutocompleteService.suggestDockerCommands('docker p'));
  // Expected: ['docker pull', 'docker push', 'docker ps']
  console.log('kubectl g... =>', AutocompleteService.suggestKubectlCommands('kubectl g'));
  // Expected: ['kubectl get pods', 'kubectl get nodes', 'kubectl get services', 'kubectl get deployments']


  console.log('\n--- Verifying LRU Cache via Jenkins Cache ---');
  JenkinsCacheService.setLog('build-1', 'Log info 1');
  JenkinsCacheService.setLog('build-2', 'Log info 2');
  
  console.log('Getting build-1:', JenkinsCacheService.getLog('build-1')); // hit
  console.log('Getting build-3:', JenkinsCacheService.getLog('build-3')); // miss
}

verify().catch(console.error);
