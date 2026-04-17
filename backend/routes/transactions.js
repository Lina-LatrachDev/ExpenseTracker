const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/role");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");

router.get("/", authMiddleware, getTransactions);
router.post("/", authMiddleware, createTransaction);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

router.get("/user/:userId", authMiddleware, authorizeRoles("admin", "editor"), async (req, res) => {
  try {
    if (req.user.role === "editor") {
      const targetUser = await User.findById(req.params.userId).select("role");

      if (!targetUser || targetUser.role !== "user") {
        return res.status(403).json({ message: "Editors can only access users' activity" });
      }
    }

    const transactions = await Transaction.find({ user: req.params.userId })
      .populate("categorie")
      .sort({ date: -1 });

    res.json({ data: transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
