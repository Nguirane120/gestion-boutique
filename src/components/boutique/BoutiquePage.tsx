"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { ACTIVITIES, INITIAL_CATEGORIES, INITIAL_KPI_TOTALS, INITIAL_PRODUCTS, NAV_HEADERS } from "./data";
import { ConfirmDialog } from "./ConfirmDialog";
import { DashboardView } from "./DashboardView";
import { DepensesView } from "./depense/DepensesView";
import { ExpenseFormModal } from "./depense/ExpenseFormModal";
import { ProductFormModal } from "./produit/ProductFormModal";
import { ProductsView } from "./produit/ProductsView";
import { SaleFormModal } from "./vente/SaleFormModal";
import { VentesView } from "./vente/VentesView";
import { Sidebar } from "./Sidebar";
import type { NavItem, Period, ProductFormData, StockItem } from "./types";
import { isInPeriod, todayISO } from "./utils";

export default function BoutiquePage() {
  const [activePeriod, setActivePeriod] = useState<Period>("Semaine");
  const [activeNav, setActiveNav]       = useState<NavItem>("dashboard");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [products, setProducts]             = useState<StockItem[]>(INITIAL_PRODUCTS);
  const [categories, setCategories]         = useState<string[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery]       = useState("");
  const [isFormOpen, setIsFormOpen]         = useState(false);
  const [editingProduct, setEditingProduct] = useState<StockItem | null>(null);
  const [deleteTarget, setDeleteTarget]     = useState<StockItem | null>(null);

  const [kpiTotals, setKpiTotals]                 = useState<Record<Period, { ventes: number; depenses: number }>>(INITIAL_KPI_TOTALS);
  const [activities, setActivities]               = useState(ACTIVITIES);
  const [isSaleFormOpen, setIsSaleFormOpen]       = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);

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
  const kpi = {
    ventes: kpiTotals[activePeriod].ventes,
    depenses: kpiTotals[activePeriod].depenses,
    benefice: kpiTotals[activePeriod].ventes - kpiTotals[activePeriod].depenses,
  };
  const periodActivities = today
    ? activities.filter((a) => isInPeriod(a.date, activePeriod, today))
    : activities;
  const ventesActivities   = periodActivities.filter((a) => a.type === "vente");
  const depensesActivities = periodActivities.filter((a) => a.type === "depense");

  const handleRecordSale = (productId: number, quantity: number, date: string, unitPrice: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const amount = unitPrice * quantity;

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock - quantity } : p))
    );
    setKpiTotals((prev) => ({
      Jour:    { ...prev.Jour,    ventes: prev.Jour.ventes + amount },
      Semaine: { ...prev.Semaine, ventes: prev.Semaine.ventes + amount },
      Mois:    { ...prev.Mois,    ventes: prev.Mois.ventes + amount },
    }));
    setActivities((prev) => [
      {
        id: prev.length ? Math.max(...prev.map((a) => a.id)) + 1 : 1,
        type: "vente" as const,
        label: product.name,
        amount,
        date,
        quantity,
        unitPrice,
        catalogPrice: product.price,
      },
      ...prev,
    ]);
    setIsSaleFormOpen(false);
  };

  const handleRecordExpense = (label: string, amount: number, date: string) => {
    setKpiTotals((prev) => ({
      Jour:    { ...prev.Jour,    depenses: prev.Jour.depenses + amount },
      Semaine: { ...prev.Semaine, depenses: prev.Semaine.depenses + amount },
      Mois:    { ...prev.Mois,    depenses: prev.Mois.depenses + amount },
    }));
    setActivities((prev) => [
      {
        id: prev.length ? Math.max(...prev.map((a) => a.id)) + 1 : 1,
        type: "depense" as const,
        label,
        amount,
        date,
      },
      ...prev,
    ]);
    setIsExpenseFormOpen(false);
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

  const handleSaveProduct = (data: ProductFormData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data } : p))
      );
    } else {
      const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      setProducts((prev) => [...prev, { id: newId, ...data }]);
    }
    closeForm();
  };

  const handleDeleteProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) setDeleteTarget(product);
  };

  const confirmDeleteProduct = () => {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleAddCategory = (name: string) => {
    setCategories((prev) =>
      prev.some((c) => c.toLowerCase() === name.toLowerCase()) ? prev : [...prev, name]
    );
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
          onConfirm={confirmDeleteProduct}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
