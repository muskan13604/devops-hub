function notFoundHandler(req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } });
}

function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const isServerError = statusCode >= 500;

  if (isServerError) console.error(error);
  res.status(statusCode).json({
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: isServerError ? 'An unexpected error occurred.' : error.message,
    },
  });
}

module.exports = { errorHandler, notFoundHandler };
