const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  montant: { type: Number, required: true, min: 0},
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  source: { type: String, default: "manual" }, // manual or automatic
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);