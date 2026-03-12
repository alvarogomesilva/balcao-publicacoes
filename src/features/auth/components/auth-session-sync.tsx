import { auth } from "@/lib/config";
import { useAuthStore } from "@/store/auth-store";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetchUserProfile } from "@/features/publications/api";
import { buildUserProfile } from "../utils/auth-user";

export function AuthSessionSync() {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setAuthReady = useAuthStore((state) => state.setAuthReady);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      void (async () => {
        if (!firebaseUser) {
          logout();
          setAuthReady(true);
          return;
        }

        try {
          const userProfile = buildUserProfile(
            firebaseUser.uid,
            await fetchUserProfile(firebaseUser.uid),
          );

          if (!userProfile) {
            await signOut(auth);
            logout();
            toast.error("Usuário sem perfil cadastrado.");
            setAuthReady(true);
            return;
          }

          login(userProfile);
          setAuthReady(true);
        } catch {
          await signOut(auth);
          logout();
          toast.error("Não foi possível sincronizar sua sessão.");
          setAuthReady(true);
        }
      })();
    });

    return unsubscribe;
  }, [login, logout, setAuthReady]);

  return null;
}
