const { NotFoundError } = require("../errors");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    throw new NotFoundError("Token not provided");
  }
  const token = authHeaders.split(" ")[1];
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { userId, name } = decoded;
    req.user = { userId, name };
    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = authMiddleware;
