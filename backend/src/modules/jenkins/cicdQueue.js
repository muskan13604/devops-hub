const Queue = require('../../shared/data-structures/Queue');

class CICDQueueService {
  constructor() {
    this.jobQueue = new Queue();
  }

  addJob(job) {
    console.log(`[CI/CD] Enqueueing job: ${job.id}`);
    this.jobQueue.enqueue({
      ...job,
      status: 'pending',
      queuedAt: new Date()
    });
  }

  processNextJob() {
    const job = this.jobQueue.dequeue();
    if (job) {
      job.status = 'processing';
      console.log(`[CI/CD] Processing job: ${job.id}`);
    }
    return job;
  }

  getPendingJobs() {
    return this.jobQueue.toArray();
  }
}

module.exports = new CICDQueueService();
