const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

exports.fetchExternal = async (req, res) => {
  const userId = req.user.id;

  const fakeTransactions = [
    { nom: "Netflix", montant: 12, type: "expense" },
    { nom: "Salary", montant: 3200, type: "income" }
  ];

  const categories = await Category.find({ user: userId });

  const transactions = fakeTransactions.map(tx => ({
    ...tx,
    user: userId,
    date: new Date(),
    categorie: categories[0]?._id
  }));

  const saved = await Transaction.insertMany(transactions);

  res.json(saved);
};