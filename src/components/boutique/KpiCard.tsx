import type { ElementType } from "react";
import { formatCFA } from "./utils";

export function KpiCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  badge,
  badgeColor,
}: {
  title: string;
  value: number;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3 flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</span>
        <div className={`${iconBg} p-2.5 rounded-xl`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-slate-900 leading-tight truncate">
        {formatCFA(value)}
      </p>
      <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${badgeColor}`}>
        {badge}
      </span>
    </div>
  );
}
