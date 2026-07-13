import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-700">
        <XCircle size={12} />
        Rupture de stock
      </span>
    );
  if (stock < 5)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-50 text-orange-700">
        <AlertTriangle size={12} />
        {stock} unités
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700">
      <CheckCircle2 size={12} />
      {stock} unités
    </span>
  );
}
