const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const User = require("../models/User");

exports.getTransactions = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100);
    const skip = (page - 1) * limit;

    const query = req.user.role === "user" ? { user: req.user.id } : {};

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate("categorie")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(query)
    ]);

    res.json({
      data: transactions.map((tx) => ({ ...tx.toObject(), id: tx._id })),
      page,
      totalPages: Math.ceil(total / limit),
      total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { categorie, type } = req.body;
    const targetUserId =
      (req.user.role === "admin" || req.user.role === "editor") && req.body.user
        ? req.body.user
        : req.user.id;

    const targetUser = await User.findById(targetUserId).select("role");
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role === "editor" && targetUser.role !== "user") {
      return res.status(403).json({ message: "Editors can only manage users' activity" });
    }

    const category = await Category.findById(categorie);
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (category.type !== type) {
      return res.status(400).json({
        message: `Category type (${category.type}) does not match transaction type (${type})`
      });
    }

    if (String(category.user) !== String(targetUserId)) {
      return res.status(400).json({
        message: "Category does not belong to the selected user"
      });
    }

    const newTransaction = new Transaction({
      ...req.body,
      user: targetUserId
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const query =
      req.user.role === "user"
        ? { _id: req.params.id, user: req.user.id }
        : { _id: req.params.id };

    const transaction = await Transaction.findOne(query);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (req.user.role === "editor") {
      const owner = await User.findById(transaction.user).select("role");
      if (!owner || owner.role !== "user") {
        return res.status(403).json({ message: "Editors can only manage users' activity" });
      }
    }

    if (req.body.categorie || req.body.type) {
      const categoryId = req.body.categorie || transaction.categorie;
      const type = req.body.type || transaction.type;
      const category = await Category.findById(categoryId);

      if (
        !category ||
        category.type !== type ||
        String(category.user) !== String(transaction.user)
      ) {
        return res.status(400).json({ message: "Category/type mismatch" });
      }
    }

    Object.assign(transaction, req.body);
    const updated = await transaction.save();

    res.json({
      message: "Transaction updated successfully",
      transaction: { ...updated.toObject(), id: updated._id }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const query =
      req.user.role === "user"
        ? { _id: req.params.id, user: req.user.id }
        : { _id: req.params.id };

    const transaction = await Transaction.findOne(query);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (req.user.role === "editor") {
      const owner = await User.findById(transaction.user).select("role");
      if (!owner || owner.role !== "user") {
        return res.status(403).json({ message: "Editors can only manage users' activity" });
      }
    }

    await transaction.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
