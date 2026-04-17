import React, { useState, useRef, useEffect } from "react";
import { FiCalendar, FiChevronDown } from "react-icons/fi";

export default function TopBar({
  setStartDate,
  setEndDate,
  currentAccount
}) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [active, setActive] = useState("today");
  const [label, setLabel] = useState("Aujourd’hui");

  const [tempStart, setTempStart] = useState("");
  const [tempEnd, setTempEnd] = useState("");

  const dropdownRef = useRef();

  const now = new Date();

  // 👋 Greeting
  const hour = now.getHours();
  let greeting = "Bonsoir";
  if (hour < 12) greeting = "Bonjour";
  else if (hour < 18) greeting = "Bon après-midi";

  const formattedDate = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // 🧠 CLICK OUTSIDE
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
        setShowCustom(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 🔥 FILTER LOGIC
  const applyFilter = (type) => {
    const end = new Date();
    const start = new Date();

    setActive(type);

    if (type === "today") {
      const today = end.toISOString().split("T")[0];
      setStartDate(today);
      setEndDate(today);
      setLabel("Aujourd’hui");
    }

    if (type === "7d") {
      start.setDate(end.getDate() - 7);
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      setLabel("7 jours");
    }

    if (type === "6m") {
      start.setMonth(end.getMonth() - 6);
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      setLabel("6 mois");
    }

    if (type === "month") {
      start.setDate(1);
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      setLabel("Ce mois");
    }

    if (type === "all") {
      setStartDate("");
      setEndDate("");
      setLabel("Tout");
    }

    setShowCustom(false);
    setOpen(false);
  };

  // 📅 CUSTOM
  const applyCustom = () => {
    if (!tempStart || !tempEnd) return;

    setStartDate(tempStart);
    setEndDate(tempEnd);
    setLabel("Personnalisé");
    setActive("custom");
    setOpen(false);
    setShowCustom(false);
  };

  // 🎨 ACTIVE STYLE
  const itemStyle = (type) =>
    `w-full text-left px-3 py-2 text-sm rounded transition ${
      active === type
        ? "bg-violet-50 text-violet-600 shadow-[0_0_0_1px_rgba(139,92,246,0.2)]"
        : "hover:bg-stone-100"
    }`;

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div>
          <span className="text-sm font-semibold block">
            {/* {greeting}, {currentAccount?.firstName || "Utilisateur"} !*/}
            🚀 {greeting}, {currentAccount?.firstName ?? "Utilisateur"} !
          </span>

          <span className="text-xs text-stone-500 capitalize">
            {formattedDate}
          </span>
        </div>

        {/* RIGHT */}
        <div className="relative" ref={dropdownRef}>

          {/* BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="
              flex items-center gap-2
              px-3 py-1.5
              rounded-lg text-sm
              border border-transparent
              hover:border-violet-400/50
              hover:shadow-[0_0_10px_rgba(139,92,246,0.25)]
              transition
            "
          >
            <FiCalendar className="text-stone-500" />

            <span className="text-stone-600">{label}</span>

            <FiChevronDown
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN */}
          <div
            className={`
              absolute right-0 mt-2 w-56
              bg-white border border-stone-200
              rounded-xl shadow-xl p-2 z-50
              transition-all duration-200
              origin-top-right
              ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
            `}
          >
            {!showCustom ? (
              <>
                <button onClick={() => applyFilter("today")} className={itemStyle("today")}>
                  Aujourd’hui
                </button>

                <button onClick={() => applyFilter("7d")} className={itemStyle("7d")}>
                  7 jours
                </button>

                <button onClick={() => applyFilter("month")} className={itemStyle("month")}>
                  Ce mois
                </button>

                <button onClick={() => applyFilter("6m")} className={itemStyle("6m")}>
                  6 mois
                </button>

                <button onClick={() => applyFilter("all")} className={itemStyle("all")}>
                  Tout
                </button>

                <div className="h-px bg-stone-200 my-2" />

                <button
                  onClick={() => setShowCustom(true)}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-stone-100 text-stone-500"
                >
                  Choisir une date
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 animate-fadeIn">

                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="p-2 border rounded text-sm"
                />

                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="p-2 border rounded text-sm"
                />

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={applyCustom}
                    className="flex-1 bg-violet-500 text-white text-sm py-1.5 rounded hover:bg-violet-600"
                  >
                    Appliquer
                  </button>

                  <button
                    onClick={() => setShowCustom(false)}
                    className="flex-1 text-sm py-1.5 rounded border hover:bg-stone-100"
                  >
                    Retour
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}