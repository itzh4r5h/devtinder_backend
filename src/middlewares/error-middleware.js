class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorMiddleware = (err, req, res, next) => {
  let message = err.message || "something went wrong";
  let statusCode = err.statusCode || 500;

  // use it only in dev mode otherwise remove it
  // console.log(err.name);

  if (err.name === "ValidationError") {
    message = Object.values(err.errors)[0].message;
    statusCode = 400;
  }
  else if (err.name === "JsonWebTokenError") {
    message = "invalid session, please signin!";
    statusCode = 401;
  }
  else if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "invalid id";
    statusCode = 400;
  }
  else if (err.name === 'SyntaxError' && err.type === 'entity.parse.failed') {
    message = 'invalid data'
    statusCode = 400
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export { CustomError, errorMiddleware };
