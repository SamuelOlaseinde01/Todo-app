const express = require("express");
const {
  getUsers,
  login,
  getUser,
  deleteUser,
} = require("../controllers/admin");
const {
  adminTokenMiddleware,
  adminMiddleware,
} = require("../middleware/adminauthmiddleware");
const router = express.Router();

router.route("/").get(adminTokenMiddleware, adminMiddleware, getUsers);
router
  .route("/:id")
  .get(adminTokenMiddleware, adminMiddleware, getUser)
  .delete(adminTokenMiddleware, adminMiddleware, deleteUser);
router.route("/login").post(login);

module.exports = router;
