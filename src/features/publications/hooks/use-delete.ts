import { database } from "@/lib/config";
import { doc, deleteDoc } from "firebase/firestore";


export const useDeletePublication = () => {

    const deletePublication = async (id: string) => {
        try {
            await deleteDoc(doc(database, "publications", id));
        } catch (error) {
            console.log(error)
        }
    }

    return { deletePublication }
}