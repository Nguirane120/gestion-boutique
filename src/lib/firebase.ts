import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
// `experimentalAutoDetectLongPolling` bascule automatiquement sur le long-polling
// quand le flux temps réel (WebChannel) est bloqué par le réseau (proxy, VPN,
// environnement de dev conteneurisé...) — sans ça, seule la lecture initiale
// fonctionne et les mises à jour temps réel n'arrivent qu'après un rechargement.
// `initializeFirestore` ne peut être appelé qu'une fois par app (utile en dev
// avec le Fast Refresh, qui peut ré-exécuter ce module) : on retombe sur
// `getFirestore` si l'instance existe déjà.
export const db = (() => {
  try {
    return initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    return getFirestore(app);
  }
})();
