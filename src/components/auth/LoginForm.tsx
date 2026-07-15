"use client";

import { useState } from "react";
import { Loader2, Store } from "lucide-react";
import { authErrorMessage, useAuth } from "@/lib/auth/AuthContext";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="bg-emerald-500 p-3 rounded-xl">
            <Store size={22} className="text-white" />
          </div>
          <div className="text-center">
            <p className="font-extrabold text-slate-900 text-lg leading-none">Fatoush Store</p>
            <p className="text-slate-400 text-sm mt-1.5">Connectez-vous pour gérer votre boutique</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@boutique.com"
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Mot de passe
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              disabled={isSubmitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>

          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
