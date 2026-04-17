const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: "#60a5fa" },
  type: { 
    type: String, 
    enum: ["expense", "income"], 
    default: "expense"
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);