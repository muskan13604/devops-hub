class UnionFind {
  constructor() {
    // Map to handle arbitrary string IDs for nodes
    this.parent = new Map();
    this.rank = new Map();
  }

  // Add a new disjoint set (node)
  add(id) {
    if (!this.parent.has(id)) {
      this.parent.set(id, id);
      this.rank.set(id, 0);
    }
  }

  // Find with path compression
  find(i) {
    if (this.parent.get(i) !== i) {
      this.parent.set(i, this.find(this.parent.get(i)));
    }
    return this.parent.get(i);
  }

  // Union by rank
  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI !== rootJ) {
      const rankI = this.rank.get(rootI);
      const rankJ = this.rank.get(rootJ);

      if (rankI < rankJ) {
        this.parent.set(rootI, rootJ);
      } else if (rankI > rankJ) {
        this.parent.set(rootJ, rootI);
      } else {
        this.parent.set(rootJ, rootI);
        this.rank.set(rootI, rankI + 1);
      }
    }
  }

  connected(i, j) {
    return this.find(i) === this.find(j);
  }

  // Groups all nodes by their root parent to identify isolated clusters
  getClusters() {
    const clusters = new Map();
    for (const [node] of this.parent.entries()) {
      const root = this.find(node);
      if (!clusters.has(root)) {
        clusters.set(root, []);
      }
      clusters.get(root).push(node);
    }
    return Array.from(clusters.values());
  }
}

module.exports = UnionFind;
