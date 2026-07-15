"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { NumberInput } from "../NumberInput";
import type { ProductFormData, StockItem } from "../types";

export function ProductFormModal({
  initialData,
  categories,
  onAddCategory,
  onClose,
  onSave,
}: {
  initialData: StockItem | null;
  categories: string[];
  onAddCategory: (name: string) => Promise<void> | void;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void> | void;
}) {
  const [name, setName]         = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [size, setSize]         = useState(initialData?.size ?? "");
  const [price, setPrice]       = useState(initialData ? String(initialData.price) : "");
  const [stock, setStock]       = useState(initialData ? String(initialData.stock) : "");
  const [error, setError]       = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory]           = useState("");
  const [isSubmitting, setIsSubmitting]                 = useState(false);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    setIsCategorySubmitting(true);
    try {
      await onAddCategory(trimmed);
      setCategory(trimmed);
      setNewCategory("");
      setIsAddingCategory(false);
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !size.trim()) {
      setError("Le nom et la taille sont obligatoires.");
      return;
    }
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!Number.isFinite(priceNum) || !Number.isFinite(stockNum)) {
      setError("Le prix et le stock doivent être des nombres.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await onSave({ name: name.trim(), category, size: size.trim(), price: priceNum, stock: stockNum });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {initialData ? "Modifier le produit" : "Nouveau produit"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Nom de l&apos;article
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Robe Fleurie"
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Catégorie
              </label>
              <button
                type="button"
                onClick={() => setIsAddingCategory((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                {isAddingCategory ? (
                  <>
                    <X size={14} strokeWidth={2.5} />
                    Annuler
                  </>
                ) : (
                  <>
                    <Plus size={14} strokeWidth={2.5} />
                    Nouvelle catégorie
                  </>
                )}
              </button>
            </div>

            {isAddingCategory ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Ex : Ceinture"
                  autoFocus
                  className="flex-1 min-w-0 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={isCategorySubmitting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex-shrink-0"
                >
                  {isCategorySubmitting && <Loader2 size={14} className="animate-spin" />}
                  Ajouter
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Aucune catégorie</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Taille
            </label>
            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Ex : M, 38..."
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Prix unitaire (F CFA)
              </label>
              <NumberInput
                value={price}
                onChange={setPrice}
                min={0}
                placeholder="0"
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Stock
              </label>
              <NumberInput
                value={stock}
                onChange={setStock}
                min={0}
                placeholder="0"
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
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
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {initialData ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
