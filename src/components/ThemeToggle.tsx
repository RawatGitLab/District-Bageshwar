import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, className = "" }) => {
  return (
    <button
      onClick={onToggle}
      type="button"
      className={`inline-flex items-center justify-center p-2 text-xs font-bold rounded-lg transition-all shadow-sm border cursor-pointer select-none bg-slate-800 border-slate-700 hover:bg-slate-700 ${className}`}
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
      aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-indigo-400" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400" />
      )}
    </button>
  );
};

export default ThemeToggle;
