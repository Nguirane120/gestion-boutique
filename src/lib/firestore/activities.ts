import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Activity } from "@/components/boutique/types";

const activitiesRef = (uid: string) => collection(db, "users", uid, "activities");
const productDoc = (uid: string, productId: string) => doc(db, "users", uid, "products", productId);

export function subscribeActivities(uid: string, onChange: (activities: Activity[]) => void) {
  const q = query(activitiesRef(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
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
        } as Activity;
      })
    );
  });
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

export function recordExpense(uid: string, label: string, amount: number, date: string) {
  return addDoc(activitiesRef(uid), {
    type: "depense",
    label,
    amount,
    date,
    createdAt: serverTimestamp(),
  });
}
