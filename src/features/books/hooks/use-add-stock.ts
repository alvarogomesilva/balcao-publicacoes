import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";

import { database } from "@/lib/config";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ValuesProps {
    id: string
    stock: number
    quantity: number
}

export const useAddStock = () => {
    const queryClient = useQueryClient()

    const addStock = async ({ id, stock, quantity }: ValuesProps) => {
        try {
            await addDoc(collection(database, "movements"), {
                publication: id,
                type: 'entrada',
                quantity: quantity,
                createdAt: serverTimestamp()
            })

            const updateDocRef = doc(database, "books", id);

            await updateDoc(updateDocRef, {
                stock: stock + quantity
            });

            toast.success('Mensagem', {
                description: "Adicionado com sucesso"
            })

        } catch (error) {
            console.log()
        }
    }

      const mutation = useMutation({
        mutationFn: addStock,
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    })

    return { 
        addStock: mutation.mutate
     }
}