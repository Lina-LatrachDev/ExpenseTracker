// demoData.js
export const demoCategories = [
  { id: "101", name: "Salaire", color: "#10b981", type: "income" },
  { id: "102", name: "Freelance", color: "#3b82f6", type: "income" },
  { id: "103", name: "Investissements", color: "#8b5cf6", type: "income" },
  { id: "104", name: "Ventes", color: "#f59e0b", type: "income" },
  { id: "201", name: "Loyer", color: "#ef4444", type: "expense" },
  { id: "202", name: "Courses", color: "#f97316", type: "expense" },
  { id: "203", name: "Essence", color: "#facc15", type: "expense" },
  { id: "204", name: "Abonnements", color: "#3f3f46", type: "expense" },
  { id: "205", name: "Restaurants", color: "#ec4899", type: "expense" },
  { id: "206", name: "Transport", color: "#6366f1", type: "expense" },
  { id: "207", name: "Cadeaux", color: "#14b8a6", type: "expense" },
];

export const demoTransactions = [
  { id: "1", nom: "Salaire Mars", type: "income", montant: 3200, categorie: "101", date: "2026-03-01T09:00" },
  { id: "2", nom: "Projet Freelance", type: "income", montant: 800, categorie: "102", date: "2026-03-05T14:00" },
  { id: "3", nom: "Vente Ancien PC", type: "income", montant: 400, categorie: "104", date: "2026-03-10T18:00" },
  { id: "4", nom: "Loyer Appartement", type: "expense", montant: 1200, categorie: "201", date: "2026-03-01T10:00" },
  { id: "5", nom: "Courses Supermarché", type: "expense", montant: 250, categorie: "202", date: "2026-03-03T16:00" },
  { id: "6", nom: "Essence Voiture", type: "expense", montant: 150, categorie: "203", date: "2026-03-07T12:00" },
  { id: "7", nom: "Netflix", type: "expense", montant: 15, categorie: "204", date: "2026-03-02T08:00" },
  { id: "8", nom: "Dîner Famille", type: "expense", montant: 60, categorie: "205", date: "2026-03-08T20:00" },
  { id: "9", nom: "Transport Taxi", type: "expense", montant: 35, categorie: "206", date: "2026-03-09T09:30" },
  { id: "10", nom: "Cadeau Anniversaire", type: "expense", montant: 100, categorie: "207", date: "2026-03-11T15:00" },
  { id: "11", nom: "Investissement Crypto", type: "income", montant: 500, categorie: "103", date: "2026-03-15T13:00" },
  { id: "12", nom: "Petit Déjeuner", type: "expense", montant: 12, categorie: "205", date: "2026-03-16T08:00" },
];