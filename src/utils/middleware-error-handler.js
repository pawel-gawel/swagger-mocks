module.exports = function middlewareErrorHandler(err, req, res, next) {
  res
    .status(err.status || 400)
    .type('html')
    .send(`<html><body><h1>${err.status} Error!</h1><pre>${err.message}</pre></body></html>`);
};

