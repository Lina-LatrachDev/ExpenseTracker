const Category = require("../models/Category");
const User = require("../models/User");

exports.getCategories = async (req, res) => {
  const query = req.user.role === "user" ? { user: req.user.id } : {};
  const categories = await Category.find(query);
  res.json(categories);
};

exports.createCategory = async (req, res) => {
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

  const newCategory = new Category({
    ...req.body,
    user: targetUserId
  });

  const saved = await newCategory.save();
  res.status(201).json(saved);
};

exports.updateCategory = async (req, res) => {
  const query =
    req.user.role === "user"
      ? { _id: req.params.id, user: req.user.id }
      : { _id: req.params.id };

  const existingCategory = await Category.findOne(query);
  if (!existingCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  if (req.user.role === "editor") {
    const owner = await User.findById(existingCategory.user).select("role");
    if (!owner || owner.role !== "user") {
      return res.status(403).json({ message: "Editors can only manage users' activity" });
    }
  }

  const category = await Category.findByIdAndUpdate(existingCategory._id, req.body, {
    new: true
  });

  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  const query =
    req.user.role === "user"
      ? { _id: req.params.id, user: req.user.id }
      : { _id: req.params.id };

  const existingCategory = await Category.findOne(query);
  if (!existingCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  if (req.user.role === "editor") {
    const owner = await User.findById(existingCategory.user).select("role");
    if (!owner || owner.role !== "user") {
      return res.status(403).json({ message: "Editors can only manage users' activity" });
    }
  }

  await existingCategory.deleteOne();
  res.json({ message: "Deleted" });
};
