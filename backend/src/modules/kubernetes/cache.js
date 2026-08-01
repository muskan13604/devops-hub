const LRUCache = require('../../shared/data-structures/LRUCache');

class KubernetesCacheService {
  constructor() {
    // Cache up to 200 Pod details to minimize K8s API calls
    this.podInfoCache = new LRUCache(200);
  }

  getPodInfo(podName) {
    const info = this.podInfoCache.get(podName);
    if (info !== -1) {
      console.log(`[Cache Hit] Pod Info for ${podName}`);
      return info;
    }
    console.log(`[Cache Miss] Pod Info for ${podName}`);
    return null;
  }

  setPodInfo(podName, infoData) {
    this.podInfoCache.put(podName, infoData);
  }
}

module.exports = new KubernetesCacheService();
