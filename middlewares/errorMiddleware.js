// errorMiddleware.js
const logger = require('./logger');

function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    status: err.status || 500
  });

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'An unexpected error occurred.',
    },
  });
}

module.exports = errorHandler;
