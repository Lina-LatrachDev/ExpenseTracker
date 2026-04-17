const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/role");
const authMiddleware = require("../middleware/auth");
const Category = require("../models/Category");
const User = require("../models/User");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

router.get("/", authMiddleware, getCategories);
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

router.get(
  "/user/:userId",
  authMiddleware,
  authorizeRoles("admin", "editor"),
  async (req, res) => {
    try {
      if (req.user.role === "editor") {
        const targetUser = await User.findById(req.params.userId).select("role");

        if (!targetUser || targetUser.role !== "user") {
          return res.status(403).json({ message: "Editors can only access users' activity" });
        }
      }

      const categories = await Category.find({ user: req.params.userId });
      res.json({ data: categories });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
