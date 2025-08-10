const { BadRequest, NotFoundError } = require("../errors");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

async function getUsers(req, res) {
  const { name } = req.user;
  const users = await User.find({}).select("-password");
  res
    .status(StatusCodes.OK)
    .json({ adminName: name, users, usersLength: users.length });
}

async function getUser(req, res) {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id of ${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
}

async function deleteUser(req, res) {
  const { id: userId } = req.params;
  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) {
    throw new NotFoundError(`No user with id of ${userId}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: `${user.name} account deleted successfully` });
}

async function login(req, res) {
  const { name, password } = req.body;
  if (name !== process.env.NAME) {
    throw new BadRequest("Invalid username provided");
  }
  const isMatch = await bcrypt.compare(password, process.env.PASSWORD);
  if (!isMatch) {
    throw new BadRequest("Password is incorrect");
  }
  const token = jwt.sign(
    { userId: process.env.ADMIN_ID, name: name, isAdmin: true },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  res.status(StatusCodes.OK).json({ user: { name: name }, token });
}

module.exports = {
  getUsers,
  login,
  getUser,
  deleteUser,
};
