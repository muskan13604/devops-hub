const LRUCache = require('../../shared/data-structures/LRUCache');

class JenkinsCacheService {
  constructor() {
    // Cache up to 100 Jenkins build logs in memory
    this.logsCache = new LRUCache(100);
  }

  getLog(buildId) {
    const log = this.logsCache.get(buildId);
    if (log !== -1) {
      console.log(`[Cache Hit] Jenkins Log for Build ${buildId}`);
      return log;
    }
    console.log(`[Cache Miss] Jenkins Log for Build ${buildId}`);
    return null;
  }

  setLog(buildId, logData) {
    this.logsCache.put(buildId, logData);
  }
}

module.exports = new JenkinsCacheService();
