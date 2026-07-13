"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { NumberInput } from "../NumberInput";
import type { StockItem } from "../types";
import { formatCFA, todayISO } from "../utils";

export function SaleFormModal({
  products,
  onClose,
  onSave,
}: {
  products: StockItem[];
  onClose: () => void;
  onSave: (productId: number, quantity: number, date: string) => void;
}) {
  const sellable = products.filter((p) => p.stock > 0);
  const [productId, setProductId] = useState<number | "">(sellable[0]?.id ?? "");
  const [quantity, setQuantity]   = useState("1");
  const [date, setDate]           = useState(todayISO());
  const [error, setError]         = useState("");

  const selected = sellable.find((p) => p.id === productId);
  const total = selected ? selected.price * (Number(quantity) || 0) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!selected) {
      setError("Sélectionnez un produit.");
      return;
    }
    if (!Number.isInteger(qty) || qty <= 0) {
      setError("La quantité doit être un nombre entier positif.");
      return;
    }
    if (qty > selected.stock) {
      setError(`Stock insuffisant (${selected.stock} unités disponibles).`);
      return;
    }
    if (!date) {
      setError("La date est obligatoire.");
      return;
    }
    onSave(selected.id, qty, date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Enregistrer une vente</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Produit</label>
            <select
              value={productId}
              onChange={(e) => setProductId(Number(e.target.value))}
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {sellable.length === 0 && <option value="">Aucun produit en stock</option>}
              {sellable.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.size}) — {p.stock} dispo.
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantité</label>
            <NumberInput
              value={quantity}
              onChange={setQuantity}
              min={1}
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
            <span className="text-sm font-semibold text-slate-500">Total</span>
            <span className="text-base font-extrabold text-slate-900">{formatCFA(total)}</span>
          </div>

          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={sellable.length === 0}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
