"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { addCategory, subscribeCategories } from "@/lib/firestore/categories";
import { recordExpense, recordSale, subscribeActivities } from "@/lib/firestore/activities";
import { addProduct, deleteProduct, subscribeProducts, updateProduct } from "@/lib/firestore/products";
import { NAV_HEADERS } from "./data";
import { ConfirmDialog } from "./ConfirmDialog";
import { DashboardView } from "./DashboardView";
import { DepensesView } from "./depense/DepensesView";
import { ExpenseFormModal } from "./depense/ExpenseFormModal";
import { ProductFormModal } from "./produit/ProductFormModal";
import { ProductsView } from "./produit/ProductsView";
import { SaleFormModal } from "./vente/SaleFormModal";
import { VentesView } from "./vente/VentesView";
import { Sidebar } from "./Sidebar";
import type { Activity, NavItem, Period, ProductFormData, StockItem } from "./types";
import { isInPeriod, todayISO } from "./utils";

export default function BoutiquePage() {
  const { user } = useAuth();
  const uid = user!.uid;

  const [activePeriod, setActivePeriod] = useState<Period>("Semaine");
  const [activeNav, setActiveNav]       = useState<NavItem>("dashboard");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [products, setProducts]             = useState<StockItem[]>([]);
  const [categories, setCategories]         = useState<string[]>([]);
  const [searchQuery, setSearchQuery]       = useState("");
  const [isFormOpen, setIsFormOpen]         = useState(false);
  const [editingProduct, setEditingProduct] = useState<StockItem | null>(null);
  const [deleteTarget, setDeleteTarget]     = useState<StockItem | null>(null);
  const [isDeleting, setIsDeleting]         = useState(false);

  const [activities, setActivities]               = useState<Activity[]>([]);
  const [isSaleFormOpen, setIsSaleFormOpen]       = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);

  useEffect(() => {
    const unsubscribeProducts   = subscribeProducts(uid, setProducts);
    const unsubscribeActivities = subscribeActivities(uid, setActivities);
    const unsubscribeCategories = subscribeCategories(uid, setCategories);
    return () => {
      unsubscribeProducts();
      unsubscribeActivities();
      unsubscribeCategories();
    };
  }, [uid]);

  // `today` reste `null` le temps du premier rendu (SSR + hydratation) pour
  // éviter tout écart entre le HTML serveur et le client, puis se met à jour
  // une fois monté côté navigateur.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    // Lecture ponctuelle de la date du jour au montage (valeur client-only,
    // cf. doc Next.js "preventing-flash-before-hydration" > Date updates live).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(todayISO());
  }, []);

  const periods: Period[] = ["Jour", "Semaine", "Mois"];
  const header  = NAV_HEADERS[activeNav];
  const periodActivities = today
    ? activities.filter((a) => isInPeriod(a.date, activePeriod, today))
    : activities;
  const ventesActivities   = periodActivities.filter((a) => a.type === "vente");
  const depensesActivities = periodActivities.filter((a) => a.type === "depense");
  const kpi = {
    ventes: ventesActivities.reduce((sum, a) => sum + a.amount, 0),
    depenses: depensesActivities.reduce((sum, a) => sum + a.amount, 0),
    benefice:
      ventesActivities.reduce((sum, a) => sum + a.amount, 0) -
      depensesActivities.reduce((sum, a) => sum + a.amount, 0),
  };

  const handleRecordSale = async (productId: string, quantity: number, date: string, unitPrice: number) => {
    try {
      await recordSale(uid, productId, quantity, date, unitPrice);
      setIsSaleFormOpen(false);
    } catch (err) {
      console.error("[Firestore] recordSale error:", err);
      alert(err instanceof Error ? err.message : "Impossible d'enregistrer la vente.");
    }
  };

  const handleRecordExpense = async (label: string, amount: number, date: string) => {
    try {
      await recordExpense(uid, label, amount, date);
      setIsExpenseFormOpen(false);
    } catch (err) {
      console.error("[Firestore] recordExpense error: ", err);
      alert("Impossible d'enregistrer la dépense.");
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item: StockItem) => {
    setEditingProduct(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(uid, editingProduct.id, data);
      } else {
        await addProduct(uid, data);
      }
      closeForm();
    } catch (err) {
      console.error("[Firestore] saveProduct error:", err);
      alert("Impossible d'enregistrer ce produit.");
    }
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) setDeleteTarget(product);
  };

  const confirmDeleteProduct = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(uid, deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("[Firestore] deleteProduct error:", err);
      alert("Impossible de supprimer ce produit.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddCategory = async (name: string) => {
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) return;
    try {
      await addCategory(uid, name);
    } catch (err) {
      console.error("[Firestore] addCategory error:", err);
      alert("Impossible d'ajouter cette catégorie.");
    }
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-slate-100">
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ZONE CENTRALE */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-slate-50">
        {/* En-tête */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex-shrink-0 p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              aria-label="Ouvrir le menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">{header.title}</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 truncate">{header.subtitle}</p>
            </div>
          </div>

          {/* Sélecteur de période (masqué sur la page Stock) */}
          {activeNav !== "stock" && (
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 overflow-x-auto max-w-full">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePeriod(p)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    activePeriod === p
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-4 sm:py-5 flex flex-col gap-5">
          {activeNav === "dashboard" && <DashboardView kpi={kpi} products={products} />}

          {activeNav === "stock" && (
            <ProductsView
              products={products}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAdd={openAddForm}
              onEdit={openEditForm}
              onDelete={handleDeleteProduct}
            />
          )}

          {activeNav === "ventes" && (
            <VentesView
              ventes={ventesActivities}
              activePeriod={activePeriod}
              onNewSale={() => setIsSaleFormOpen(true)}
            />
          )}

          {activeNav === "depenses" && (
            <DepensesView
              depenses={depensesActivities}
              activePeriod={activePeriod}
              onNewExpense={() => setIsExpenseFormOpen(true)}
            />
          )}
        </div>
      </main>

      {isFormOpen && (
        <ProductFormModal
          initialData={editingProduct}
          categories={categories}
          onAddCategory={handleAddCategory}
          onClose={closeForm}
          onSave={handleSaveProduct}
        />
      )}

      {isSaleFormOpen && (
        <SaleFormModal
          products={products}
          onClose={() => setIsSaleFormOpen(false)}
          onSave={handleRecordSale}
        />
      )}

      {isExpenseFormOpen && (
        <ExpenseFormModal
          onClose={() => setIsExpenseFormOpen(false)}
          onSave={handleRecordExpense}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Supprimer ce produit ?"
          message={`« ${deleteTarget.name} » sera définitivement retiré du catalogue.`}
          confirmLabel="Supprimer"
          isLoading={isDeleting}
          onConfirm={confirmDeleteProduct}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
