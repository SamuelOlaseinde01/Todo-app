const express = require("express");
const { register, login } = require("../controllers/auth");
const { rateLimit } = require("express-rate-limit");
const upload = require("../middleware/upload");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 5, // Allow only 5 attempts
  message: { error: "Too many attempts, please try again later" },
});

router.route("/register").post(authLimiter, upload.single("image"), register);
router.route("/login").post(authLimiter, login);

module.exports = router;
