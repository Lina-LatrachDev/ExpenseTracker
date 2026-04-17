import AccountToggle from "./AccountToggle";
import { Plan } from "./Plan";
import { RouteSelect } from "./RouteSelect";
import Search from "./Search";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({
  accounts,
  onAddAccountClick,
  searchTerm,
  setSearchTerm
}) {
  const { currentUser } = useAuth();
  const role = currentUser?.role?.toLowerCase();
  const roleBadgeClass =
    role === "admin"
      ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200"
      : role === "editor"
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        : "bg-violet-50 text-violet-700 ring-1 ring-violet-200";


  return (
   <div> 
    <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)]">
      <AccountToggle
        accounts={accounts}
        //currentAccount={currentAccount}
        //setCurrentAccount={setCurrentAccount}
        //onLogout={onLogout}
        onAddAccountClick={onAddAccountClick}
      />
      {/* <Search searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}/>*/}
      <div>
      <div className="p-2 text-sm">
        <span className={`mt-1 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold capitalize shadow-sm ${roleBadgeClass}`}>
          {currentUser?.role || "user"}
        </span>
      </div>
    </div>
      <RouteSelect />
      </div>

      <Plan />
    </div>
  );
}