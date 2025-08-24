import { database } from "@/lib/config";
import type { RegisterPublication } from "@/validations/register-publication-validation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export const useRegister = () => {

    const registerPublication = async (inputs: RegisterPublication) => {
        const { name, code, category, active } = inputs
        try {
            await addDoc(collection(database, "publications"), {
                active,
                name,
                code: code || 0,
                category,
                stock: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            toast.success("Sucesso", {
                description: "Criado com sucesso!"
            })
        } catch (error) {
            console.log(error)
        }
    }

    return { registerPublication }
}