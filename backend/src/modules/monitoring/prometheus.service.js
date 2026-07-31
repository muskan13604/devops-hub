const { AppError } = require('../../shared/errors/AppError');

// Defaults to standard local Prometheus port, or environment variable
const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';

async function queryPrometheus(query) {
  try {
    const response = await fetch(`${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Prometheus API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data.result;
  } catch (error) {
    console.error('Prometheus query failed:', error.message);
    // Instead of completely failing the app if Prometheus isn't running locally, we return dummy/empty data
    // This allows the dashboard to still load even if a user doesn't have a local Prometheus stack deployed.
    return [];
  }
}

async function getMetrics() {
  try {
    // We will query some basic standard Kubernetes/Node metrics
    const cpuQuery = 'sum(rate(container_cpu_usage_seconds_total[1m])) by (pod)';
    const memQuery = 'sum(container_memory_working_set_bytes) by (pod)';
    
    // Fire queries concurrently
    const [cpuResult, memResult] = await Promise.all([
      queryPrometheus(cpuQuery),
      queryPrometheus(memQuery)
    ]);
    
    // Transform the raw PromQL result into something easier for the frontend to consume
    const metrics = {
      cpu: cpuResult.map(r => ({ pod: r.metric.pod || 'system', value: parseFloat(r.value[1]) })),
      memory: memResult.map(r => ({ pod: r.metric.pod || 'system', value: parseFloat(r.value[1]) }))
    };
    
    return metrics;
  } catch (error) {
    throw new AppError(`Failed to fetch monitoring metrics: ${error.message}`, 500);
  }
}

module.exports = {
  getMetrics,
  queryPrometheus
};
