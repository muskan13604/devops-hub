const UnionFind = require('../../shared/data-structures/UnionFind');

class ClusterNetworkService {
  constructor() {
    this.network = new UnionFind();
    this.nodes = new Set();
  }

  addNode(nodeId) {
    this.network.add(nodeId);
    this.nodes.add(nodeId);
  }

  connectNodes(nodeA, nodeB) {
    this.addNode(nodeA);
    this.addNode(nodeB);
    this.network.union(nodeA, nodeB);
  }

  areNodesConnected(nodeA, nodeB) {
    return this.network.connected(nodeA, nodeB);
  }

  getIsolatedClusters() {
    const clusters = this.network.getClusters();
    return clusters;
  }
}

module.exports = new ClusterNetworkService();
