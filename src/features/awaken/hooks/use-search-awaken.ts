import { database } from "@/lib/config";
import { collection, getDocs } from "firebase/firestore";

export const useSearchAwaken = () => {

    const searchAwaken = async (search: string) => {
        try {
            const usersRef = collection(database, "awaken")

            const snapshot = await getDocs(usersRef)
            const data = snapshot.docs.map(doc => doc.data())

            // Filtra manualmente se contém em qualquer parte da string
            return data.filter((item: any) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            )

        } catch (error) {
            console.log(error)
        }
    }

    return { searchAwaken }
}
