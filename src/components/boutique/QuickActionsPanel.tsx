import { ArrowDownRight, ArrowUpRight, CheckCircle2, MinusCircle, PlusCircle } from "lucide-react";
import type { Activity, Period } from "./types";
import { formatCFA } from "./utils";

export function QuickActionsPanel({
  activePeriod,
  kpi,
  activities,
  saleFlash,
  expenseFlash,
  onOpenSaleForm,
  onOpenExpenseForm,
}: {
  activePeriod: Period;
  kpi: { ventes: number; depenses: number; benefice: number };
  activities: Activity[];
  saleFlash: boolean;
  expenseFlash: boolean;
  onOpenSaleForm: () => void;
  onOpenExpenseForm: () => void;
}) {
  return (
    <aside className="w-[30%] min-w-[300px] bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0">
      {/* En-tête panneau */}
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-extrabold text-slate-900">Enregistrement rapide</h2>
        <p className="text-xs text-slate-400 mt-0.5">Appuyez pour saisir un mouvement</p>
      </div>

      {/* Corps scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
        {/* Boutons d'action */}
        <section className="flex flex-col gap-3">
          <button
            onClick={onOpenSaleForm}
            className={`w-full py-5 rounded-2xl font-extrabold text-white text-base transition-all duration-150 flex items-center justify-center gap-3 shadow-md active:scale-95 cursor-pointer ${
              saleFlash
                ? "bg-green-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saleFlash ? (
              <>
                <CheckCircle2 size={22} />
                Vente enregistrée !
              </>
            ) : (
              <>
                <PlusCircle size={22} />
                Enregistrer une Vente
              </>
            )}
          </button>

          <button
            onClick={onOpenExpenseForm}
            className={`w-full py-5 rounded-2xl font-extrabold text-white text-base transition-all duration-150 flex items-center justify-center gap-3 shadow-md active:scale-95 cursor-pointer ${
              expenseFlash
                ? "bg-orange-400"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {expenseFlash ? (
              <>
                <CheckCircle2 size={22} />
                Dépense enregistrée !
              </>
            ) : (
              <>
                <MinusCircle size={22} />
                Ajouter une Dépense
              </>
            )}
          </button>
        </section>

        {/* Résumé période */}
        <section className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Résumé · {activePeriod}
          </h3>
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Ventes</span>
              <span className="text-sm font-bold text-green-600">+{formatCFA(kpi.ventes)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Dépenses</span>
              <span className="text-sm font-bold text-red-500">-{formatCFA(kpi.depenses)}</span>
            </div>
            <div className="h-px bg-slate-200 my-0.5" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-800">Bénéfice net</span>
              <span className="text-base font-extrabold text-blue-700">
                +{formatCFA(kpi.benefice)}
              </span>
            </div>
          </div>
        </section>

        {/* Dernières activités */}
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Dernières activités
          </h3>
          <ul className="flex flex-col gap-3">
            {activities.slice(0, 6).map((act) => (
              <li
                key={act.id}
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div
                  className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${
                    act.type === "vente" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {act.type === "vente" ? (
                    <ArrowUpRight size={15} className="text-green-600" />
                  ) : (
                    <ArrowDownRight size={15} className="text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 leading-snug">
                    {act.type === "vente" ? "Vente" : "Dépense"} : {act.label}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-slate-400">{act.time}</span>
                    <span
                      className={`text-sm font-extrabold ${
                        act.type === "vente" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {act.type === "vente" ? "+" : "-"}{formatCFA(act.amount)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Pied panneau */}
      <div className="px-6 py-3 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">
          Dimanche 13 juillet 2026 · Dakar, Sénégal
        </p>
      </div>
    </aside>
  );
}
