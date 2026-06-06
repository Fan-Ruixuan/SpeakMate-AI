const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ code: 500, msg: 'Internal server error' });
};

module.exports = errorMiddleware;