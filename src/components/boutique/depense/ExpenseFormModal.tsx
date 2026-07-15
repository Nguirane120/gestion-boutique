"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { NumberInput } from "../NumberInput";
import { todayISO } from "../utils";

export function ExpenseFormModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (label: string, amount: number, date: string) => Promise<void> | void;
}) {
  const [label, setLabel]   = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate]     = useState(todayISO());
  const [error, setError]   = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError("Indiquez le motif de la dépense.");
      return;
    }
    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError("Le montant doit être supérieur à zéro.");
      return;
    }
    if (!date) {
      setError("La date est obligatoire.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await onSave(label.trim(), amountNum, date);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Ajouter une dépense</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Motif</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex : Facture Senelec"
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Montant (F CFA)</label>
            <NumberInput
              value={amount}
              onChange={setAmount}
              min={0}
              placeholder="0"
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
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
