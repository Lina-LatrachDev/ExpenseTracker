const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const authMiddleware = require("../middleware/auth");

router.get("/fetch-external", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const fakeTransactions = [
      { nom: "Netflix", montant: 12, type: "expense" },
      { nom: "Salary", montant: 3200, type: "income" },
      { nom: "Uber", montant: 45, type: "expense" },
      { nom: "Starbucks", montant: 8, type: "expense" },
      { nom: "Amazon", montant: 120, type: "expense" }
    ];

    const defaultCategoryMap = {
      "Netflix": "Entertainment",
      "Amazon": "Shopping",
      "Uber": "Transport",
      "Starbucks": "Food & Drinks",
      "Salary": "Income"
    };

    const categoryDocs = await Promise.all(
      Object.values(defaultCategoryMap).map(async catName => {
        let cat = await Category.findOne({ name: catName, user: userId });
        if (!cat) {
          cat = new Category({ 
            name: catName, 
            user: userId,
            type: catName === "Income" ? "income" : "expense",
            color: "#60a5fa"
          });
          await cat.save();
        }
        return cat;
      })
    );

    const categoryMap = {};
    categoryDocs.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const transactions = fakeTransactions.map(tx => ({
      nom: tx.nom,
      type: tx.type,
      montant: Math.floor(tx.montant * (0.8 + Math.random() * 0.4)),
      categorie: categoryMap[defaultCategoryMap[tx.nom]] || null,
      source: "api",
      user: userId,
      date: new Date()
    }));

    const savedTransactions = await Transaction.insertMany(transactions);

    res.json({
      message: "Simulated bank transactions with categories added",
      data: savedTransactions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;