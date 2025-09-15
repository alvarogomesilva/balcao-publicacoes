import { database } from "@/lib/config";
import type { RegisterPublication } from "@/validations/register-publication-validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export const useRegisterAwaken = () => {
    const queryClient = useQueryClient()

    const registerAwaken = async (inputs: RegisterPublication) => {
        const { name, code, active } = inputs
        try {
            await addDoc(collection(database, "awaken"), {
                active,
                name,
                code: code || 0,
                category: 'despertai',
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

    const mutation = useMutation({
        mutationFn: registerAwaken,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["awaken"] });
        },
    })

    return {
        registerAwaken: mutation.mutate
    }
}