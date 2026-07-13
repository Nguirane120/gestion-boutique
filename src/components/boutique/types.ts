export type Period = "Jour" | "Semaine" | "Mois";
export type NavItem = "dashboard" | "stock" | "ventes" | "depenses";

export interface StockItem {
  id: number;
  name: string;
  category: string;
  size: string;
  price: number;
  stock: number;
}

export type ProductFormData = Omit<StockItem, "id">;

export interface Activity {
  id: number;
  type: "vente" | "depense";
  label: string;
  amount: number;
  date: string; // format ISO "aaaa-mm-jj"
  quantity?: number; // uniquement pour les ventes
}
