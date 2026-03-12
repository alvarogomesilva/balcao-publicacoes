import { fetchUserProfile } from "@/features/publications/api";
import { auth } from "@/lib/config";
import { useAuthStore } from "@/store/auth-store";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { toast } from "sonner";
import { buildUserProfile } from "../utils/auth-user";

export const useSignIn = () => {
  const [signInWithEmailAndPassword, , loading] = useSignInWithEmailAndPassword(auth);
  const loginUser = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      const credentials = await signInWithEmailAndPassword(email, password);

      if (!credentials) {
        toast.error("Email ou senha incorretos.");
        return false;
      }

      const profileData = await fetchUserProfile(credentials.user.uid);
      const profile = buildUserProfile(credentials.user.uid, profileData);

      if (!profile) {
        await signOut(auth);
        toast.error("Usuario sem perfil cadastrado.");
        return false;
      }

      loginUser(profile);
      navigate("/");
      return true;
    } catch {
      toast.error("Nao foi possivel entrar. Verifique suas credenciais.");
      return false;
    }
  };

  return { signIn, loading };
};
