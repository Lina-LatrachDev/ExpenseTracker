const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const {
  getProfile,
  deleteUser,
  getAllUsers,
  getUserById,
  getAdminDashboard,
  updateUserRole
} = require("../controllers/userController");

router.get("/profile", auth, getProfile);
router.get("/admin-dashboard", auth, authorizeRoles("admin"), getAdminDashboard);
router.get("/", auth, authorizeRoles("admin", "editor"), getAllUsers);
router.get("/:id", auth, authorizeRoles("admin", "editor"), getUserById);
router.patch("/:id/role", auth, authorizeRoles("admin"), updateUserRole);
router.delete("/:id", auth, authorizeRoles("admin"), deleteUser);

module.exports = router;
