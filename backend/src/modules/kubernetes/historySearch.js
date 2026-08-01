const binarySearch = require('../../shared/utils/binarySearch');

class HistorySearchService {
  constructor() {
    // Array of deployment records, sorted by timestamp (ascending)
    this.deploymentHistory = [];
  }

  addDeploymentRecord(record) {
    this.deploymentHistory.push(record);
    // Ensure it remains sorted by timestamp for binary search
    this.deploymentHistory.sort((a, b) => a.timestamp - b.timestamp);
  }

  searchByTimestamp(targetTimestamp) {
    return binarySearch(this.deploymentHistory, targetTimestamp, 'timestamp');
  }
  
  getHistory() {
    return this.deploymentHistory;
  }
}

module.exports = new HistorySearchService();
