// hash-admin-password.js
require("dotenv").config();
const bcrypt = require("bcryptjs");

async function hashPassword() {
  const plainPassword = process.env.PASSWORD; // change this to your actual password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plainPassword, salt);
  console.log("Hashed Password:", hashed);
}

hashPassword();
