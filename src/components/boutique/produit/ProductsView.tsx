import { useState } from "react";
import { Pencil, PlusCircle, Search, Shirt, Trash2 } from "lucide-react";
import { Pagination } from "../Pagination";
import { StockBadge } from "./StockBadge";
import type { StockItem } from "../types";

const PAGE_SIZE = 5;

export function ProductsView({
  products,
  searchQuery,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete,
}: {
  products: StockItem[];
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onAdd: () => void;
  onEdit: (item: StockItem) => void;
  onDelete: (id: string) => void;
}) {
  const [page, setPage] = useState(1);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <Shirt size={18} className="text-slate-500" />
          <h2 className="text-base font-bold text-slate-800">Catalogue Produits</h2>
          <span className="text-xs text-slate-400 font-medium ml-1">{products.length} articles</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un produit..."
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-56"
            />
          </div>
          <button
            onClick={onAdd}
            aria-label="Nouveau produit"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Nouveau produit</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead className="bg-slate-50">
          <tr>
            {["Article", "Catégorie", "Taille", "Prix unitaire", "Stock", ""].map((h) => (
              <th
                key={h}
                className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((item, i) => (
            <tr
              key={item.id}
              className={`border-t border-slate-50 hover:bg-slate-50/70 transition-colors ${
                i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
              }`}
            >
              <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{item.category || "—"}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{item.size}</td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                {item.price.toLocaleString("fr-FR")} F
              </td>
              <td className="px-6 py-4">
                <StockBadge stock={item.stock} />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                    aria-label="Modifier"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                Aucun produit ne correspond à votre recherche.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
