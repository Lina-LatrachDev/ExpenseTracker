const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

exports.getAllUsers = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const role = req.query.role?.trim() || "";
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      };
    }

    if (role && ["admin", "editor", "user"].includes(role)) {
      query = {
        ...query,
        role
      };
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.json({
      success: true,
      data: users,
      page,
      totalPages,
      total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, totalTransactions, totalCategories, recentUsers, recentTransactions] =
      await Promise.all([
        User.countDocuments(),
        Transaction.countDocuments(),
        Category.countDocuments(),
        User.find()
          .select("-password")
          .sort({ createdAt: -1 })
          .limit(5),
        Transaction.find()
          .populate("user", "firstName lastName email")
          .populate("categorie", "name")
          .sort({ createdAt: -1 })
          .limit(5)
      ]);

    res.json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          transactions: totalTransactions,
          categories: totalCategories
        },
        recentUsers,
        recentTransactions
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "editor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin role cannot be changed here" });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
