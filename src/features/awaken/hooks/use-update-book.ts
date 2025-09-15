import { database } from "@/lib/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";


interface ValuesProps {
    id: string
    name: string
}

export const useUpdateAwaken = () => {
    const queryClient = useQueryClient()
    const updateAwaken = async (values: ValuesProps) => {
        try {
            const publication = doc(database, "awaken", values.id);

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
        mutationFn: updateAwaken,
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["awaken"] });
        },
    })

    return { 
        updateAwaken: mutation.mutate
     }
}