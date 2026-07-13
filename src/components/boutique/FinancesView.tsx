import { ArrowDownRight, ArrowUpRight, MinusCircle, PlusCircle, TrendingUp } from "lucide-react";
import { formatCFA } from "./utils";
import type { Activity } from "./types";

export function FinancesView({
  activities,
  onNewSale,
  onNewExpense,
}: {
  activities: Activity[];
  onNewSale: () => void;
  onNewExpense: () => void;
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <TrendingUp size={18} className="text-slate-500" />
          <h2 className="text-base font-bold text-slate-800">Historique des flux</h2>
          <span className="text-xs text-slate-400 font-medium ml-1">{activities.length} mouvements</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewSale}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <PlusCircle size={16} />
            Nouvelle vente
          </button>
          <button
            onClick={onNewExpense}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <MinusCircle size={16} />
            Nouvelle dépense
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            {["Type", "Détail", "Montant", "Date"].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activities.map((act, i) => (
            <tr
              key={act.id}
              className={`border-t border-slate-50 hover:bg-slate-50/70 transition-colors ${
                i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
              }`}
            >
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                    act.type === "vente" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {act.type === "vente" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {act.type === "vente" ? "Vente" : "Dépense"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-700">{act.label}</td>
              <td
                className={`px-6 py-4 text-sm font-extrabold ${
                  act.type === "vente" ? "text-green-600" : "text-red-500"
                }`}
              >
                {act.type === "vente" ? "+" : "-"}{formatCFA(act.amount)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">{act.time}</td>
            </tr>
          ))}
          {activities.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">
                Aucun mouvement enregistré pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
