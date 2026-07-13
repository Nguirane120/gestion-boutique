import { LayoutDashboard, Package, TrendingUp } from "lucide-react";
import type { Activity, NavItem, Period, StockItem } from "./types";

export const INITIAL_KPI_TOTALS: Record<Period, { ventes: number; depenses: number }> = {
  Jour:    { ventes: 45_000,    depenses: 12_000  },
  Semaine: { ventes: 280_000,   depenses: 85_000  },
  Mois:    { ventes: 1_200_000, depenses: 350_000 },
};

export const INITIAL_PRODUCTS: StockItem[] = [
  { id: 1, name: "Robe Fleurie",  category: "Robe",     size: "M",  price: 18_500, stock: 12 },
  { id: 2, name: "Jean Slim",     category: "Pantalon", size: "38", price: 22_000, stock: 3  },
  { id: 3, name: "Jupe Rouge",    category: "Jupe",     size: "S",  price: 14_000, stock: 0  },
  { id: 4, name: "Blouse Dorée",  category: "Haut",     size: "L",  price: 16_500, stock: 7  },
];

export const CATEGORIES = ["Robe", "Pantalon", "Jupe", "Haut", "Chaussures", "Accessoire"];

export const ACTIVITIES: Activity[] = [
  { id: 1, type: "vente",   label: "2× Robes Fleuries", amount: 37_000, time: "Il y a 12 min" },
  { id: 2, type: "depense", label: "Facture Senelec",    amount: 45_000, time: "Il y a 1h"     },
  { id: 3, type: "vente",   label: "1× Jean Slim",       amount: 22_000, time: "Il y a 2h"     },
];

export const NAV_ITEMS = [
  { id: "dashboard" as NavItem, label: "Tableau de bord", icon: LayoutDashboard },
  { id: "stock"     as NavItem, label: "Mon Stock",        icon: Package          },
  { id: "finances"  as NavItem, label: "Flux Financiers",  icon: TrendingUp       },
];

export const NAV_HEADERS: Record<NavItem, { title: string; subtitle: string }> = {
  dashboard: { title: "Tableau de bord",       subtitle: "Suivi · Boutique Kiné Fashion" },
  stock:     { title: "Gestion des Produits",  subtitle: "Ajoutez, modifiez et suivez votre catalogue" },
  finances:  { title: "Flux Financiers",       subtitle: "Ventes, dépenses et bénéfices" },
};
