const YamlDiff = require('../src/shared/utils/yamlDiff');
const YamlValidator = require('../src/shared/utils/yamlValidator');
const CICDQueueService = require('../src/modules/jenkins/cicdQueue');
const HistorySearchService = require('../src/modules/kubernetes/historySearch');
const ClusterNetworkService = require('../src/modules/kubernetes/clusterNetwork');

async function verifyPhase2() {
  console.log('--- Verifying YamlDiff (DP Edit Distance) ---');
  const yaml1 = `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: nginx`;
    
  const yaml2 = `apiVersion: v1
kind: Pod
metadata:
  name: my-pod-v2
spec:
  containers:
  - name: my-container
    image: nginx:latest`;

  const diffResult = YamlDiff.diff(yaml1, yaml2);
  console.log('Diff Output:');
  diffResult.forEach(line => console.log(`[${line.type}] ${line.value}`));


  console.log('\n--- Verifying YamlValidator (Stack) ---');
  const validYaml = `metadata: { name: "test", labels: [ "app", "web" ] }`;
  const invalidYaml = `metadata: { name: "test", labels: [ "app", "web" }`;
  
  console.log('Valid YAML Check:', YamlValidator.validate(validYaml));
  console.log('Invalid YAML Check:', YamlValidator.validate(invalidYaml));


  console.log('\n--- Verifying CICDQueue (Queue) ---');
  CICDQueueService.addJob({ id: 'job-1' });
  CICDQueueService.addJob({ id: 'job-2' });
  console.log('Pending Jobs:', CICDQueueService.getPendingJobs().map(j => j.id));
  CICDQueueService.processNextJob();
  console.log('Pending Jobs After Processing 1:', CICDQueueService.getPendingJobs().map(j => j.id));


  console.log('\n--- Verifying HistorySearch (Binary Search) ---');
  HistorySearchService.addDeploymentRecord({ id: 'dep-1', timestamp: 1000 });
  HistorySearchService.addDeploymentRecord({ id: 'dep-2', timestamp: 2000 });
  HistorySearchService.addDeploymentRecord({ id: 'dep-3', timestamp: 3000 });
  
  console.log('Search for timestamp 2000:', HistorySearchService.searchByTimestamp(2000));
  console.log('Search for timestamp 2500 (not found):', HistorySearchService.searchByTimestamp(2500));


  console.log('\n--- Verifying ClusterNetwork (Union Find) ---');
  // Group 1: Nodes A, B, C
  ClusterNetworkService.connectNodes('nodeA', 'nodeB');
  ClusterNetworkService.connectNodes('nodeB', 'nodeC');
  // Group 2: Nodes D, E (Isolated from Group 1)
  ClusterNetworkService.connectNodes('nodeD', 'nodeE');
  
  console.log('Are nodeA and nodeC connected?', ClusterNetworkService.areNodesConnected('nodeA', 'nodeC')); // true
  console.log('Are nodeA and nodeD connected?', ClusterNetworkService.areNodesConnected('nodeA', 'nodeD')); // false
  console.log('Isolated Clusters:', ClusterNetworkService.getIsolatedClusters());
}

verifyPhase2().catch(console.error);
