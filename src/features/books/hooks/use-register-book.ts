import { database } from "@/lib/config";
import type { RegisterPublication } from "@/validations/register-publication-validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export const useRegisterBook = () => {
    const queryClient = useQueryClient()

    const registerBook = async (inputs: RegisterPublication) => {
        const { name, code, active } = inputs
        try {
            await addDoc(collection(database, "books"), {
                active,
                name,
                code: code || 0,
                category: 'livro',
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
        mutationFn: registerBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    })

    return {
        registerBook: mutation.mutate
    }
}