import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, ChevronDown } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useState } from "react";

// Hook pour récupérer l'utilisateur connecté via Convex auth
export function useCurrentUser() {
  return useQuery(api.auth.getCurrentUser);
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

  const handleGoogle = async () => {
    try {
      setIsSubmitting(true);
      await signIn("google");
    } catch (err: any) {
      console.error(err);
      alert("Erreur de connexion Google : " + (err.message || err));
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  const handleGitHub = async () => {
    try {
      setIsSubmitting(true);
      await signIn("github");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
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
    const label = identity.name ?? identity.email ?? "Utilisateur";
    const avatar = (identity.picture ?? identity.avatar ?? "") as string;

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
          <span className="text-slate-700 truncate max-w-32">{label}</span>
          <ChevronDown size={12} />
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-50">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs text-slate-500">Connecté en tant que</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{label}</p>
              {identity.email && <p className="text-xs text-slate-400 truncate">{identity.email}</p>}
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
        <FaGoogle size={12} />
        Se connecter
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-50">
          <button
            onClick={handleGoogle}
            disabled={isSubmitting}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-[#EDFAF3] transition disabled:opacity-50"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4285F4] text-white">
              <FaGoogle size={14} />
            </div>
            Google
          </button>
          <button
            onClick={handleGitHub}
            disabled={isSubmitting}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-[#EDFAF3] transition disabled:opacity-50"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#24292F] text-white">
              <FaGithub size={14} />
            </div>
            GitHub
          </button>
        </div>
      )}
    </div>
  );
}