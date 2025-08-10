const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "You must provide your first name"],
      trim: true,
      match: [/^[a-zA-Z\s'-]+$/, "Invalid first name"],
      minlength: 3,
      maxlength: 50,
    },
    lastname: {
      type: String,
      required: [true, "You must provide your last name"],
      trim: true,
      match: [/^[a-zA-Z\s'-]+$/, "Invalid last name"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "You must provide an email"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
        "Invalid email",
      ],
    },
    password: {
      type: String,
      required: [true, "You must provide a password"],
      minlength: 8,
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.createToken = function () {
  const token = jwt.sign(
    { userId: this._id, name: this.firstname },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  return token;
};

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
