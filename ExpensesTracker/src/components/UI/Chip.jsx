import { FiX } from "react-icons/fi";

export default function Chip({ label, onRemove }) {
  return (
    <div className="flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:text-violet-900 transition"
      >
        <FiX size={14} />
      </button>
    </div>
  );
}