import { database } from "@/lib/config";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";


interface ValuesProps {
    id: string
    name: string
}

export const useUpdatePublication = () => {

    const updatePublication = async (values: ValuesProps) => {
        try {
            const publication = doc(database, "publications", values.id);

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

    return { updatePublication }
}