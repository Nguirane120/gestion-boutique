export type Period = "Jour" | "Semaine" | "Mois";
export type NavItem = "dashboard" | "stock" | "ventes" | "depenses";

export interface StockItem {
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  stock: number;
}

export type ProductFormData = Omit<StockItem, "id">;

export interface Activity {
  id: string;
  type: "vente" | "depense";
  label: string;
  amount: number;
  date: string; // format ISO "aaaa-mm-jj"
  quantity?: number; // uniquement pour les ventes
  unitPrice?: number; // prix de vente négocié, uniquement pour les ventes
  catalogPrice?: number; // prix catalogue au moment de la vente, uniquement pour les ventes
  productId?: string; // uniquement pour les ventes
}
