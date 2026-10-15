// LoginButton.tsx

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";

// Hook pour récupérer l'utilisateur connecté via Convex auth
export function useCurrentUser() {
  return useQuery(api.users.getCurrentUser);
}

export function useIsAuthenticated() {
  const identity = useCurrentUser();
  return identity !== null;
}

export function LoginButton() {
  const identity = useCurrentUser();
  const { signIn, signOut } = useAuthActions();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setError("Email invalide");
      return false;
    }
    // Convex Auth default minimum password length is 8 characters
    if (password.length < 8) {
      setError("Mot de passe trop court (min 8 caractères)");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setError("");
      setIsSubmitting(true);
      await signIn("password", {
        email,
        password,
        flow: "signIn",
      });
      setIsOpen(false);
    } catch (err: any) {
      // Intercepte les erreurs d'identifiants invalides de Convex Auth
      if (
        err.message?.includes("InvalidSecret") ||
        err.message?.includes("not found") ||
        err.message?.includes("credentials")
      ) {
        setError("Email ou mot de passe incorrect");
      } else {
        setError(err.message || "Erreur de connexion");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      setError("");
      setIsSubmitting(true);
      // Register with email, name, phone and password
      await signIn("password", {
        email,
        name,
        phone,
        password,
        flow: "signUp",
      });
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || "Erreur d'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSubmitting(true);
      await signOut();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  if (identity) {
    const label = (identity as any).name ?? (identity as any).email ?? "Utilisateur";
    const avatar = ((identity as any).picture ?? (identity as any).avatar ?? "") as string;

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(v => !v)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
        >
          {avatar ? (
            <img
              src={avatar}
              alt={label}
              className="h-5 w-5 rounded-full object-cover"
            />
          ) : (
            <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              {label.charAt(0).toUpperCase()}
            </div>
          )}
          <ChevronDown size={12} />
          <span className="text-slate-700 truncate max-w-32">{label}</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-50">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs text-slate-500">Connecté en tant que</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{label}</p>
              {(identity as any).email && <p className="text-xs text-slate-400 truncate">{(identity as any).email}</p>}
            </div>
            <button
              onClick={handleSignOut}
              disabled={isSubmitting}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(v => !v)}
        className="flex items-center gap-1.5 rounded-lg bg-[#0F2147] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0a1a33] transition shadow-sm"
      >
        Se connecter
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border border-slate-200 bg-white shadow-lg p-3 z-50">
          {showRegister ? (
            <>
              <div className="mb-3 space-y-2">
                <input
                  type="text"
                  placeholder="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10"
                />
                <input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10"
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Mot de passe (min 8)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10"
                />
              </div>
              {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
              <button
                onClick={handleRegister}
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#0F2147] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0a1a33] transition disabled:opacity-50"
              >
                Créer le compte
              </button>
              <button
                onClick={() => setShowRegister(v => !v)}
                className="mt-2 w-full text-xs text-[#0F2147] hover:text-[#0a1a33] underline"
              >
                ← Retour connexion
              </button>
            </>
          ) : (
            <>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10"
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Mot de passe (min 8)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10"
                />
              </div>
              {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
              <button
                onClick={handleLogin}
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#0F2147] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0a1a33] transition disabled:opacity-50"
              >
                Connexion
              </button>
              <button
                onClick={() => setShowRegister(v => !v)}
                className="mt-2 w-full text-xs text-[#0F2147] hover:text-[#0a1a33] underline"
              >
                Créer un compte
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
