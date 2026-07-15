import { connection } from "next/server";
import { AuthGate } from "@/components/auth/AuthGate";
import { AuthProvider } from "@/lib/auth/AuthContext";
import BoutiquePage from "@/components/boutique/BoutiquePage";

export default async function Page() {
  // L'app dépend entièrement de l'état d'authentification Firebase (client-only) :
  // on exclut la page du prerendering statique plutôt que de l'évaluer au build.
  await connection();

  return (
    <AuthProvider>
      <AuthGate>
        <BoutiquePage />
      </AuthGate>
    </AuthProvider>
  );
}
