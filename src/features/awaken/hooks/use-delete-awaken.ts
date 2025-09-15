import { database } from "@/lib/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, deleteDoc } from "firebase/firestore";


export const useDeleteAwaken = () => {
    const queryClient = useQueryClient()

    const deleteAwaken = async (id: string) => {
        try {
            await deleteDoc(doc(database, "awaken", id));
        } catch (error) {
            console.log(error)
        }
    }

    const mutation = useMutation({
        mutationFn: deleteAwaken,
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["awaken"] });
        },
    })

    return { 
        deleteAwaken: mutation.mutate
     }
}