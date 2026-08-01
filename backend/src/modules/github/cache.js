const LRUCache = require('../../shared/data-structures/LRUCache');

class GithubCacheService {
  constructor() {
    // Cache up to 100 Repository details (e.g. metadata, branches)
    this.repoCache = new LRUCache(100);
  }

  getRepoDetails(repoFullName) {
    const details = this.repoCache.get(repoFullName);
    if (details !== -1) {
      console.log(`[Cache Hit] Repo Details for ${repoFullName}`);
      return details;
    }
    console.log(`[Cache Miss] Repo Details for ${repoFullName}`);
    return null;
  }

  setRepoDetails(repoFullName, detailsData) {
    this.repoCache.put(repoFullName, detailsData);
  }
}

module.exports = new GithubCacheService();
