import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ProductFormData, StockItem } from "@/components/boutique/types";

const productsRef = (uid: string) => collection(db, "users", uid, "products");

export function subscribeProducts(uid: string, onChange: (products: StockItem[]) => void) {
  const q = query(productsRef(uid), orderBy("name"));
  return onSnapshot(
    q,
    (snapshot) => {
      onChange(
        snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name,
            category: data.category,
            size: data.size,
            price: data.price,
            stock: data.stock,
          } as StockItem;
        })
      );
    },
    (error) => console.error("[Firestore] products subscription error:", error)
  );
}

export function addProduct(uid: string, data: ProductFormData) {
  return addDoc(productsRef(uid), data);
}

export function updateProduct(uid: string, id: string, data: ProductFormData) {
  return updateDoc(doc(productsRef(uid), id), { ...data });
}

export function deleteProduct(uid: string, id: string) {
  return deleteDoc(doc(productsRef(uid), id));
}
