const { StatusCodes } = require("http-status-codes");
const User = require("../model/User");
const { BadRequest } = require("../errors");

async function register(req, res) {
  const { firstname, lastname, password, email } = req.body;
  let profileImage = "";
  if (req.file) {
    profileImage = req.file.path;
  }
  const user = await User.create({
    firstname,
    lastname,
    password,
    email,
    profileImage,
  });
  res.status(StatusCodes.CREATED).json({ firstname: user.firstname });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email) {
    throw new BadRequest("Please provide email");
  }
  if (!password) {
    throw new BadRequest("Please provide password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequest("Email cannot be found, please create a new account");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new BadRequest("Password is incorrect");
  }
  const token = user.createToken();
  res.status(StatusCodes.OK).json({ user: { name: user.firstname }, token });
}

module.exports = {
  register,
  login,
};
