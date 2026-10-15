// LoginButton.tsx

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

// Logo Google officiel (4 couleurs), en SVG inline pour éviter une dépendance.
function LogoGoogle({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

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

  /**
   * Connexion via Google (OAuth).
   *
   * Redirige vers Google puis revient sur le site. Le compte est créé
   * automatiquement dans la table `users` à la première connexion.
   */
  const handleGoogle = async () => {
    try {
      setError("");
      setIsSubmitting(true);
      await signIn("google", { redirectTo: "/forum" });
    } catch (err: any) {
      setError(err?.message || "Connexion Google impossible");
      setIsSubmitting(false);
    }
    // En cas de succès la page est quittée : on ne réactive pas le bouton.
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
              {/* Connexion Google */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <LogoGoogle />}
                Continuer avec Google
              </button>

              <div className="my-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] uppercase tracking-wide text-slate-400">ou</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

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
