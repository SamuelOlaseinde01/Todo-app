const { NotFoundError, UnAuthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

async function adminTokenMiddleware(req, res, next) {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    throw new NotFoundError("Token not provided");
  }
  const token = authHeaders.split(" ")[1];
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { userId, name, isAdmin } = decoded;
    req.user = { userId, name, isAdmin };
    next();
  } catch (error) {
    console.log(error);
  }
}

async function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    throw new UnAuthenticatedError("Only accessible by admin");
  }
  next();
}

module.exports = { adminTokenMiddleware, adminMiddleware };
