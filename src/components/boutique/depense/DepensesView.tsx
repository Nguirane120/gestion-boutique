"use client";

import { useState } from "react";
import { ArrowDownRight, MinusCircle } from "lucide-react";
import { Pagination } from "../Pagination";
import { formatCFA, formatDate } from "../utils";
import type { Activity, Period } from "../types";

const PAGE_SIZE = 6;

export function DepensesView({
  depenses,
  activePeriod,
  onNewExpense,
}: {
  depenses: Activity[];
  activePeriod: Period;
  onNewExpense: () => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(depenses.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = depenses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalDepenses = depenses.reduce((sum, a) => sum + a.amount, 0);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <MinusCircle size={18} className="text-slate-500" />
          <h2 className="text-base font-bold text-slate-800">Historique des dépenses</h2>
          <span className="text-xs text-slate-400 font-medium ml-1">{depenses.length} dépenses</span>
        </div>

        <button
          onClick={onNewExpense}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
        >
          <MinusCircle size={16} />
          Nouvelle dépense
        </button>
      </div>

      <div className="overflow-x-auto">
      <table className="w-full min-w-[480px]">
        <thead className="bg-slate-50">
          <tr>
            {["Motif", "Montant", "Date"].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((act, i) => (
            <tr
              key={act.id}
              className={`border-t border-slate-50 hover:bg-slate-50/70 transition-colors ${
                i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
              }`}
            >
              <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <ArrowDownRight size={14} className="text-red-500" />
                  {act.label}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-extrabold text-red-500">-{formatCFA(act.amount)}</td>
              <td className="px-6 py-4 text-sm text-slate-400">{formatDate(act.date)}</td>
            </tr>
          ))}
          {depenses.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-10 text-center text-sm text-slate-400">
                Aucune dépense enregistrée pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      <div className="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Total dépenses · {activePeriod}
        </span>
        <span className="text-base font-extrabold text-red-500">-{formatCFA(totalDepenses)}</span>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
