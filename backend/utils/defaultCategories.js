const DEFAULT_CATEGORIES = [
  { name: "Alimentation", type: "expense", color: "#f59e0b" },
  { name: "Transport", type: "expense", color: "#3b82f6" },
  { name: "Logement", type: "expense", color: "#6366f1" },
  { name: "Loisirs", type: "expense", color: "#ec4899" },
  { name: "Shopping", type: "expense", color: "#8b5cf6" },
  { name: "Sante", type: "expense", color: "#ef4444" },
  { name: "Factures", type: "expense", color: "#f97316" },
  { name: "Salaire", type: "income", color: "#10b981" },
  { name: "Freelance", type: "income", color: "#14b8a6" },
  { name: "Autres revenus", type: "income", color: "#22c55e" }
];

const buildDefaultCategoriesForUser = (userId) =>
  DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    user: userId
  }));

module.exports = {
  DEFAULT_CATEGORIES,
  buildDefaultCategoriesForUser
};
