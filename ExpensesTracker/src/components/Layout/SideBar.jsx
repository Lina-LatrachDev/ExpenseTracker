export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-white shadow-xl p-6">

      <h2 className="text-2xl font-bold mb-10 text-green-600">
        ExpenseTracker
      </h2>

      <nav className="flex flex-col gap-2">

        <button className="text-left px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium">
          Dashboard
        </button>

        <button className="text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition">
          Transactions
        </button>

        <button className="text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition">
          Categories
        </button>

      </nav>

    </div>
  );
}