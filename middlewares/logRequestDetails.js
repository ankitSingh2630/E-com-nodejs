const logger = require('../controllers/logger'); // adjust path as needed

const logRequestDetails = (req, res, next) => {
  res.on('finish', () => {
    logger.info({
      message: 'Request log',
      label: 'HTTP',
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      statusCode: res.statusCode,
      response: res.locals.data || res.statusMessage
    });
  });
  next();
};

module.exports = logRequestDetails;
