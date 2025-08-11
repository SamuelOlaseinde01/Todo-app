const { StatusCodes } = require("http-status-codes");

async function errorHandlingMiddleware(err, req, res, next) {
  const normMsg = err.message.split("name: ")[1];
  let customError = {
    msg: normMsg
      ? normMsg
      : err.message || "Something went wrong, try again later",
    statusCode: err.statusCode || 500,
  };

  if (
    customError.msg.startsWith(
      "User validation failed: password: Path `password`"
    )
  ) {
    customError.msg = "Password must be at least 8 characters long";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (customError.msg === "Invalid first name, last") {
    customError.msg = "Invalid first and last name";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (customError.msg.startsWith("User validation failed: email")) {
    customError.msg = customError.msg.split("email: ")[1];
  }

  if (err.code === 11000) {
    customError.msg = `${Object.keys(err.keyValue)} already exists`;
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlingMiddleware;
