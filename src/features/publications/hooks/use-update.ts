import { database } from "@/lib/config";
import { doc, updateDoc } from "firebase/firestore";

export const useUpdatePublication = () => {

    const updatePublication = async () => {
        try {
            const publication = doc(database, "publications", );

            await updateDoc(publication, {
                capital: true
            });


        } catch (error) {
            console.log(error)
        }
    }

    return { updatePublication }
}