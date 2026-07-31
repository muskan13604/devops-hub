const prometheusService = require('./prometheus.service');

async function getDashboardMetrics(req, res, next) {
  try {
    const metrics = await prometheusService.getMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardMetrics
};
