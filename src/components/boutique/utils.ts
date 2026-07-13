import type { Period } from "./types";

export const formatCFA = (n: number) => Math.abs(n).toLocaleString("fr-FR") + " F CFA";

export const todayISO = () => new Date().toISOString().slice(0, 10);

const parseISO = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const dayIndex = (d.getDay() + 6) % 7; // 0 = lundi
  d.setDate(d.getDate() - dayIndex);
  return d;
};

// Indique si une date ISO "aaaa-mm-jj" appartient à la période (Jour/Semaine/Mois)
// en cours, relative à `todayIso`. Semaine = semaine calendaire (lundi -> dimanche).
export const isInPeriod = (iso: string, period: Period, todayIso: string): boolean => {
  if (period === "Jour") return iso === todayIso;

  const date = parseISO(iso);
  const today = parseISO(todayIso);

  if (period === "Semaine") {
    const weekStart = startOfWeek(today);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return date >= weekStart && date <= weekEnd;
  }

  // Mois
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
};

// Formatte une date ISO "aaaa-mm-jj" en "samedi 1 janvier 2026".
// On construit la Date à partir des composants locaux (pas new Date(iso))
// pour éviter tout décalage de fuseau horaire lié au parsing UTC.
export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
