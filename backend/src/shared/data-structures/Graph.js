class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(source, destination) {
    if (!this.adjacencyList.has(source)) {
      this.addVertex(source);
    }
    if (!this.adjacencyList.has(destination)) {
      this.addVertex(destination);
    }
    // Assuming directed graph for dependencies (source depends on destination or vice versa)
    // For deployment, if A depends on B, we add a directed edge B -> A to signify B must be deployed before A.
    this.adjacencyList.get(source).push(destination);
  }

  bfs(startNode) {
    const visited = new Set();
    const queue = [startNode];
    const result = [];

    visited.add(startNode);

    while (queue.length > 0) {
      const current = queue.shift();
      result.push(current);

      const neighbors = this.adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return result;
  }

  dfs(startNode) {
    const visited = new Set();
    const result = [];

    const dfsHelper = (node) => {
      visited.add(node);
      result.push(node);

      const neighbors = this.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      }
    };

    dfsHelper(startNode);
    return result;
  }

  // Useful for resolving deployment orders where dependencies must be satisfied first
  topologicalSort() {
    const visited = new Set();
    const stack = [];

    const topologicalSortHelper = (node) => {
      visited.add(node);

      const neighbors = this.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          topologicalSortHelper(neighbor);
        }
      }
      stack.unshift(node); // Push to front for topological order
    };

    for (const [vertex] of this.adjacencyList) {
      if (!visited.has(vertex)) {
        topologicalSortHelper(vertex);
      }
    }

    return stack;
  }
}

module.exports = Graph;
