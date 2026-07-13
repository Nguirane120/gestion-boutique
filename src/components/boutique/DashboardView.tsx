import { MinusCircle, Shirt, ShoppingBag, TrendingUp } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { StockBadge } from "./produit/StockBadge";
import type { StockItem } from "./types";

export function DashboardView({
  kpi,
  products,
}: {
  kpi: { ventes: number; depenses: number; benefice: number };
  products: StockItem[];
}) {
  return (
    <>
      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Ventes"
          value={kpi.ventes}
          icon={ShoppingBag}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          badge="▲ Recettes"
          badgeColor="bg-green-100 text-green-700"
        />
        <KpiCard
          title="Dépenses"
          value={kpi.depenses}
          icon={MinusCircle}
          iconBg="bg-red-50"
          iconColor="text-red-500"
          badge="▼ Charges"
          badgeColor="bg-red-100 text-red-600"
        />
        <KpiCard
          title="Bénéfice Estimé"
          value={kpi.benefice}
          icon={TrendingUp}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          badge="● Net"
          badgeColor="bg-blue-100 text-blue-700"
        />
      </section>

      {/* Tableau Stock (aperçu) */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <Shirt size={18} className="text-slate-500" />
            <h2 className="text-base font-bold text-slate-800">État du Stock</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">{products.length} articles</span>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-50">
            <tr>
              {["Article", "Catégorie", "Taille", "Prix unitaire", "Stock"].map((h) => (
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
            {products.map((item, i) => (
              <tr
                key={item.id}
                className={`border-t border-slate-50 hover:bg-slate-50/70 transition-colors ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                }`}
              >
                <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.category}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.size}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                  {item.price.toLocaleString("fr-FR")} F
                </td>
                <td className="px-6 py-4">
                  <StockBadge stock={item.stock} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </>
  );
}
