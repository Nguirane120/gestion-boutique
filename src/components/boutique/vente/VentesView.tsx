"use client";

import { useState } from "react";
import { ArrowUpRight, Pencil, PlusCircle, ShoppingBag } from "lucide-react";
import { Pagination } from "../Pagination";
import { formatCFA, formatDate } from "../utils";
import type { Activity, Period } from "../types";

const PAGE_SIZE = 6;

export function VentesView({
  ventes,
  activePeriod,
  onNewSale,
  onEdit,
}: {
  ventes: Activity[];
  activePeriod: Period;
  onNewSale: () => void;
  onEdit: (activity: Activity) => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(ventes.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = ventes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalVentes = ventes.reduce((sum, a) => sum + a.amount, 0);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <ShoppingBag size={18} className="text-slate-500" />
          <h2 className="text-base font-bold text-slate-800">Historique des ventes</h2>
          <span className="text-xs text-slate-400 font-medium ml-1">{ventes.length} ventes</span>
        </div>

        <button
          onClick={onNewSale}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
        >
          <PlusCircle size={16} />
          Nouvelle vente
        </button>
      </div>

      <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead className="bg-slate-50">
          <tr>
            {["Produit", "Quantité", "Prix unitaire", "Prix de vente", "Montant", "Date", ""].map((h) => (
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
                  <ArrowUpRight size={14} className="text-green-600" />
                  {act.label}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{act.quantity ?? "—"}</td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {act.catalogPrice !== undefined ? formatCFA(act.catalogPrice) : "—"}
              </td>
              <td className="px-6 py-4 text-sm text-slate-700 font-semibold">
                {act.unitPrice !== undefined ? formatCFA(act.unitPrice) : "—"}
              </td>
              <td className="px-6 py-4 text-sm font-extrabold text-green-600">+{formatCFA(act.amount)}</td>
              <td className="px-6 py-4 text-sm text-slate-400">{formatDate(act.date)}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onEdit(act)}
                  className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                  aria-label="Modifier"
                >
                  <Pencil size={15} />
                </button>
              </td>
            </tr>
          ))}
          {ventes.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">
                Aucune vente enregistrée pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      <div className="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Total ventes · {activePeriod}
        </span>
        <span className="text-base font-extrabold text-green-600">+{formatCFA(totalVentes)}</span>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
