"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
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
  onSave: (productId: string, quantity: number, date: string, unitPrice: number) => Promise<void> | void;
}) {
  const sellable = products.filter((p) => p.stock > 0);
  const [productId, setProductId] = useState<string>(sellable[0]?.id ?? "");
  const [quantity, setQuantity]   = useState("1");
  const [unitPrice, setUnitPrice] = useState(sellable[0] ? String(sellable[0].price) : "");
  const [date, setDate]           = useState(todayISO());
  const [error, setError]         = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selected = sellable.find((p) => p.id === productId);
  const unitPriceNum = Number(unitPrice) || 0;
  const total = unitPriceNum * (Number(quantity) || 0);
  const remise = selected ? selected.price - unitPriceNum : 0;

  const handleProductChange = (id: string) => {
    setProductId(id);
    const product = sellable.find((p) => p.id === id);
    setUnitPrice(product ? String(product.price) : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    if (!Number.isFinite(unitPriceNum) || unitPriceNum <= 0) {
      setError("Le prix de vente doit être supérieur à zéro.");
      return;
    }
    if (!date) {
      setError("La date est obligatoire.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await onSave(selected.id, qty, date, unitPriceNum);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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
              onChange={(e) => handleProductChange(e.target.value)}
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
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Prix de vente (F CFA)
            </label>
            <NumberInput
              value={unitPrice}
              onChange={setUnitPrice}
              min={0}
              placeholder="0"
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {selected && (
              <p className="text-xs text-slate-400">
                Prix catalogue : {formatCFA(selected.price)}
                {remise > 0 && (
                  <span className="text-emerald-600 font-semibold"> · Remise de {formatCFA(remise)} après marchandage</span>
                )}
                {remise < 0 && (
                  <span className="text-orange-600 font-semibold"> · Majoration de {formatCFA(-remise)} par rapport au catalogue</span>
                )}
              </p>
            )}
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
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={sellable.length === 0 || isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
