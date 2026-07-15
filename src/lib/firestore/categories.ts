import { arrayUnion, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { INITIAL_CATEGORIES } from "@/components/boutique/data";

const settingsDoc = (uid: string) => doc(db, "users", uid, "settings", "general");

export function subscribeCategories(uid: string, onChange: (categories: string[]) => void) {
  return onSnapshot(settingsDoc(uid), (snapshot) => {
    const categories = snapshot.data()?.categories as string[] | undefined;
    onChange(categories ?? INITIAL_CATEGORIES);
  });
}

export async function addCategory(uid: string, name: string) {
  const ref = settingsDoc(uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, { categories: [...INITIAL_CATEGORIES, name] });
    return;
  }
  await setDoc(ref, { categories: arrayUnion(name) }, { merge: true });
}
