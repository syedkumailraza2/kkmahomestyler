const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

module.exports = notFound;