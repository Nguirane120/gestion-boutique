"use client";

import { Store } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { LoginForm } from "./LoginForm";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="bg-emerald-500 p-3 rounded-xl animate-pulse">
            <Store size={22} className="text-white" />
          </div>
          <p className="text-sm font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
