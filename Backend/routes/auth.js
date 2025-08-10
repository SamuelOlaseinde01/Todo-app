const express = require("express");
const { register, login } = require("../controllers/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.route("/register").post(upload.single("image"), register);
router.route("/login").post(login);

module.exports = router;
