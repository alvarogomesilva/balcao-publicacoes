import { database } from "@/lib/config";
import type { RegisterPublication } from "@/validations/register-publication-validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export const registerSentinelService = () => {
    const queryClient = useQueryClient()

    const registerSentinel = async (inputs: RegisterPublication) => {
        const { name, code, active } = inputs
        try {
            await addDoc(collection(database, "sentinels"), {
                active,
                name,
                code: code || 0,
                category: 'sentinela',
                stock: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            toast.success("Sucesso", {
                description: "Registrado com sucesso"
            })
        } catch (error) {
            console.log(error)
        }
    }

    const mutation = useMutation({
        mutationFn: registerSentinel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sentinels"] });
        },
    })

    return {
        registerSentinel: mutation.mutate
    }
}