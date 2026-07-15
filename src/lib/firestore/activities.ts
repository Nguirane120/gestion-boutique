import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Activity } from "@/components/boutique/types";

const activitiesRef = (uid: string) => collection(db, "users", uid, "activities");
const productDoc = (uid: string, productId: string) => doc(db, "users", uid, "products", productId);

export function subscribeActivities(uid: string, onChange: (activities: Activity[]) => void) {
  const q = query(activitiesRef(uid), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      onChange(
        snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            type: data.type,
            label: data.label,
            amount: data.amount,
            date: data.date,
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            catalogPrice: data.catalogPrice,
            productId: data.productId,
          } as Activity;
        })
      );
    },
    (error) => console.error("[Firestore] activities subscription error:", error)
  );
}

export async function recordSale(
  uid: string,
  productId: string,
  quantity: number,
  date: string,
  unitPrice: number
) {
  const productRef = productDoc(uid, productId);
  const activityRef = doc(activitiesRef(uid));

  await runTransaction(db, async (tx) => {
    const productSnap = await tx.get(productRef);
    if (!productSnap.exists()) throw new Error("Ce produit n'existe plus.");

    const product = productSnap.data();
    const newStock = product.stock - quantity;
    if (newStock < 0) throw new Error("Stock insuffisant pour cette vente.");

    tx.update(productRef, { stock: newStock });
    tx.set(activityRef, {
      type: "vente",
      productId,
      label: product.name,
      amount: unitPrice * quantity,
      date,
      quantity,
      unitPrice,
      catalogPrice: product.price,
      createdAt: serverTimestamp(),
    });
  });
}

export async function updateSale(
  uid: string,
  activityId: string,
  productId: string,
  quantity: number,
  date: string,
  unitPrice: number
) {
  const activityRef = doc(activitiesRef(uid), activityId);
  const productRef = productDoc(uid, productId);

  await runTransaction(db, async (tx) => {
    const activitySnap = await tx.get(activityRef);
    if (!activitySnap.exists()) throw new Error("Cette vente n'existe plus.");
    const oldQuantity: number = activitySnap.data().quantity ?? 0;

    const productSnap = await tx.get(productRef);
    let label = activitySnap.data().label;
    let catalogPrice = activitySnap.data().catalogPrice;

    // Le produit peut avoir été supprimé depuis : on met alors à jour la vente
    // sans toucher au stock, plutôt que de bloquer la correction.
    if (productSnap.exists()) {
      const product = productSnap.data();
      const newStock = product.stock + oldQuantity - quantity;
      if (newStock < 0) throw new Error("Stock insuffisant pour cette modification.");
      tx.update(productRef, { stock: newStock });
      label = product.name;
      catalogPrice = product.price;
    }

    tx.update(activityRef, {
      quantity,
      unitPrice,
      date,
      amount: unitPrice * quantity,
      label,
      catalogPrice,
    });
  });
}

export function recordExpense(uid: string, label: string, amount: number, date: string) {
  return addDoc(activitiesRef(uid), {
    type: "depense",
    label,
    amount,
    date,
    createdAt: serverTimestamp(),
  });
}

export function updateExpense(uid: string, activityId: string, label: string, amount: number, date: string) {
  return updateDoc(doc(activitiesRef(uid), activityId), { label, amount, date });
}
