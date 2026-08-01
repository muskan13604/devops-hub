const SegmentTree = require('../../shared/data-structures/SegmentTree');

class MonitoringDashboard {
  constructor() {
    // Simulated historical log arrays (e.g., 100 data points of CPU and Mem percentages)
    // In a real scenario, this would be periodically flushed to a TSDB.
    this.cpuLogs = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100));
    this.memLogs = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100));

    // Initialize Segment Trees for fast queries
    // Sum for average calculations
    this.cpuSumTree = new SegmentTree(this.cpuLogs, (a, b) => a + b);
    // Max for peak load calculations
    this.cpuMaxTree = new SegmentTree(this.cpuLogs, Math.max);
    this.memMaxTree = new SegmentTree(this.memLogs, Math.max);
  }

  // Simulates an incoming metric over time
  updateMetric(index, cpuVal, memVal) {
    this.cpuLogs[index] = cpuVal;
    this.memLogs[index] = memVal;

    this.cpuSumTree.update(index, cpuVal);
    this.cpuMaxTree.update(index, cpuVal);
    this.memMaxTree.update(index, memVal);
  }

  getAverageCpu(startIdx, endIdx) {
    const sum = this.cpuSumTree.query(startIdx, endIdx);
    if (sum === null) return 0;
    const count = (endIdx - startIdx) + 1;
    return sum / count;
  }

  getPeakCpu(startIdx, endIdx) {
    return this.cpuMaxTree.query(startIdx, endIdx);
  }

  getPeakMemory(startIdx, endIdx) {
    return this.memMaxTree.query(startIdx, endIdx);
  }
}

module.exports = new MonitoringDashboard();
