import { database } from "@/lib/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";


interface ValuesProps {
    id: string
    name: string
}

export const useUpdateBook = () => {
    const queryClient = useQueryClient()
    const updateBook = async (values: ValuesProps) => {
        try {
            const publication = doc(database, "books", values.id);

            await updateDoc(publication, {
                name: values.name
            });

            toast.success('Sucesso', {
                description: "Atualizado com sucesso!"
            })
        } catch (error) {
            console.log(error)
        }
    }

    const mutation = useMutation({
        mutationFn: updateBook,
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    })

    return { 
        updateBook: mutation.mutate
     }
}