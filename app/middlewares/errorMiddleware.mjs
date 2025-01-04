// Error-handling middleware
function errorMiddleware(err, req, res, next) {
  console.error(err.message);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
}

export default errorMiddleware;
