import { LayoutDashboard, MinusCircle, Package, ShoppingBag } from "lucide-react";
import type { NavItem } from "./types";

export const INITIAL_CATEGORIES = ["Robe", "Pantalon", "Jupe", "Haut", "Chaussures", "Accessoire"];

export const NAV_ITEMS = [
  { id: "dashboard" as NavItem, label: "Tableau de bord", icon: LayoutDashboard },
  { id: "stock"     as NavItem, label: "Mon Stock",        icon: Package          },
  { id: "ventes"    as NavItem, label: "Ventes",           icon: ShoppingBag      },
  { id: "depenses"  as NavItem, label: "Dépenses",         icon: MinusCircle      },
];

export const NAV_HEADERS: Record<NavItem, { title: string; subtitle: string }> = {
  dashboard: { title: "Tableau de bord",       subtitle: "Suivi · Boutique Fatoush Store" },
  stock:     { title: "Gestion des Produits",  subtitle: "Ajoutez, modifiez et suivez votre catalogue" },
  ventes:    { title: "Ventes",                subtitle: "Historique de vos ventes" },
  depenses:  { title: "Dépenses",              subtitle: "Historique de vos dépenses" },
};
