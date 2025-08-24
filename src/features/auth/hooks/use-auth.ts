import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, database } from "@/lib/config";
import { useNavigate } from "react-router";
import { useAuthStore, type User } from "@/store/auth-store";
import { toast } from "sonner";

export const useSignIn = () => {
    const [signInWithEmailAndPassword, loading] = useSignInWithEmailAndPassword(auth)
    const loginUser = useAuthStore((state) => state.login)
    const navigate = useNavigate()

    const signIn = async (email: string, password: string) => {
        try {
            const user = await signInWithEmailAndPassword(email, password)

            if (user) {
                const docRef = doc(database, "users", user?.user.uid);
                const docSnap = await getDoc(docRef);
                localStorage.setItem("@u", JSON.stringify(docSnap.data()));
                loginUser(docSnap.data() as User)
                navigate('/')
            } else {
                toast.error('Email/senha incorretos!')
            }

        } catch (error) {
            console.clear()
        }
    }

    return { signIn, loading }
}