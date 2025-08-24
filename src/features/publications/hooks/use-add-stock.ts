import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";

import { database } from "@/lib/config";
import { toast } from "sonner";

export const useAddStock = () => {

    const addStock = async (id: string, stock: number, quantity: number) => {
        try {
            await addDoc(collection(database, "movements"), {
                publication: id,
                type: 'entrada',
                quantity: quantity,
                createdAt: serverTimestamp()
            })

            const updateDocRef = doc(database, "publications", id);

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

    return { addStock }
}