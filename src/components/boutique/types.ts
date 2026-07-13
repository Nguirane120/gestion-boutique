export type Period = "Jour" | "Semaine" | "Mois";
export type NavItem = "dashboard" | "stock" | "finances";

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
  time: string;
}
