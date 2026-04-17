import { FiSearch, FiChevronDown, FiCalendar } from "react-icons/fi";
import Chip from "../UI/Chip";

export default function FiltersBar({ filters, setFilters, categories }) {
  const {
    search,
    selectedCategory,
    typeFilter,
    startDate,
    endDate
  } = filters;

  const update = (key, value) => {
  setFilters(prev => {
    const updated = { ...prev, [key]: value };

    // Reset category if type changes
    if (key === "typeFilter") {
      updated.selectedCategory = "all";
    }

    return updated;
  });
  };

  const reset = () => {
    setFilters({
      search: "",
      selectedCategory: "all",
      typeFilter: "all",
      startDate: "",
      endDate: ""
    });
  };

  const filteredCategories =
    typeFilter === "all"
    ? categories
    : categories.filter(cat => cat.type === typeFilter);

  return (
    <div className="max-w-5xl mx-auto bg-white p-5 rounded-2xl shadow-md mb-6">

      {/* Top Row */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl w-full md:w-1/3 focus-within:ring-2 focus-within:ring-violet-500">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => update("search", e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* Reset */}
        <button
          onClick={reset}
          className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100 transition"
        >
          Réinitialiser
        </button>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Catégorie</label>
          <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => update("selectedCategory", e.target.value)}
            disabled={filteredCategories.length === 0}
            className={`w-full appearance-none px-3 py-2 rounded-xl outline-none text-sm
              ${filteredCategories.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 focus:ring-2 focus:ring-violet-500"
              }`}
          >
            <option value="all">Toutes</option>

            {filteredCategories.length === 0 ? (
              <option disabled>Aucune catégorie</option>
            ) : (
              filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
            <FiChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Type</label>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => update("typeFilter", e.target.value)}
              className="w-full appearance-none px-3 py-2 rounded-xl bg-gray-100 focus:ring-2 focus:ring-violet-500 outline-none text-sm"
            >
              <option value="all">Tous</option>
              <option value="income">Revenu</option>
              <option value="expense">Dépense</option>
            </select>
            <FiChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Date début</label>
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl focus-within:ring-2 focus-within:ring-violet-500">
            <FiCalendar className="text-gray-500 mr-2" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => update("startDate", e.target.value)}
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Date fin</label>
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl focus-within:ring-2 focus-within:ring-violet-500">
            <FiCalendar className="text-gray-500 mr-2" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => update("endDate", e.target.value)}
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

      </div>

      {/* Active Chips */}
      <div className="flex flex-wrap gap-2 mt-4">

        {search && (
          <Chip
            label={`Recherche: ${search}`}
            onRemove={() => update("search", "")}
          />
        )}

        {selectedCategory !== "all" && (
          <Chip
            label={`Catégorie: ${
              categories.find(c => c.id.toString() === selectedCategory)?.name
            }`}
            onRemove={() => update("selectedCategory", "all")}
          />
        )}

        {typeFilter !== "all" && (
          <Chip
            label={`Type: ${
              typeFilter === "income" ? "Revenu" : "Dépense"
            }`}
            onRemove={() => update("typeFilter", "all")}
          />
        )}

        {startDate && (
          <Chip
            label={`De: ${startDate}`}
            onRemove={() => update("startDate", "")}
          />
        )}

        {endDate && (
          <Chip
            label={`À: ${endDate}`}
            onRemove={() => update("endDate", "")}
          />
        )}

      </div>

    </div>
  );
}