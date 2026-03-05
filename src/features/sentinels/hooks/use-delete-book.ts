import { database } from "@/lib/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, deleteDoc } from "firebase/firestore";


export const useDeleteBook = () => {
    const queryClient = useQueryClient()

    const deleteBook = async (id: string) => {
        try {
            await deleteDoc(doc(database, "sentinels", id));
        } catch (error) {
            console.log(error)
        }
    }

    const mutation = useMutation({
        mutationFn: deleteBook,
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sentinels"] });
        },
    })

    return { 
        deleteBook: mutation.mutate
     }
}