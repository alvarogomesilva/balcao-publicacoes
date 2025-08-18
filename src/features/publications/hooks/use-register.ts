import { database } from "@/lib/config";
import type { RegisterPublication } from "@/validations/register-publication-validation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export const useRegister = () => {

    const registerPublication = async (inputs: RegisterPublication) => {
        const { name, code } = inputs
        try {
            await addDoc(collection(database, "publications"), {
                name,
                code,
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