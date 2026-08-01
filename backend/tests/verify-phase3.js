const MonitoringDashboard = require('../src/modules/monitoring/dashboard');

async function verifyPhase3() {
  console.log('--- Verifying SegmentTree via Monitoring Dashboard ---');
  
  // Set some known values at specific indices
  // Let's set index 10 to 50, index 11 to 60, index 12 to 70
  MonitoringDashboard.updateMetric(10, 50, 20);
  MonitoringDashboard.updateMetric(11, 60, 80);
  MonitoringDashboard.updateMetric(12, 70, 90);
  
  const avgCpu = MonitoringDashboard.getAverageCpu(10, 12);
  console.log(`Average CPU from idx 10 to 12 (expected 60): ${avgCpu}`);
  
  const peakCpu = MonitoringDashboard.getPeakCpu(10, 12);
  console.log(`Peak CPU from idx 10 to 12 (expected 70): ${peakCpu}`);
  
  const peakMem = MonitoringDashboard.getPeakMemory(10, 12);
  console.log(`Peak Memory from idx 10 to 12 (expected 90): ${peakMem}`);
}

verifyPhase3().catch(console.error);
