import { Store } from "lucide-react";
import { NAV_ITEMS } from "./data";
import type { NavItem } from "./types";

export function Sidebar({
  activeNav,
  onNavChange,
}: {
  activeNav: NavItem;
  onNavChange: (nav: NavItem) => void;
}) {
  return (
    <aside className="w-[15%] min-w-[190px] bg-slate-900 flex flex-col h-full flex-shrink-0 select-none">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2.5 rounded-xl flex-shrink-0">
            <Store size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-none">Kiné Fashion</p>
            <p className="text-emerald-400 text-xs mt-1 font-medium">Boutique</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">
          Menu
        </p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => onNavChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-sm font-semibold leading-tight">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Pied de sidebar */}
      <div className="px-5 py-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">AD</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">Kiné Diallo</p>
            <p className="text-slate-400 text-xs">Gérante</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
