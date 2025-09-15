import { database } from "@/lib/config"
import { useQuery } from "@tanstack/react-query"
import { collection, query, getDocs, limit } from "firebase/firestore"

interface Awaken {
  id: string
  active: boolean
  name: string
  code: string
  category: string
  stock: string
  createdAt: Date
}

const getAllAwaken = async (): Promise<Awaken[]> => {
  const q = query(collection(database, "awaken"), limit(5))
  const querySnapshot = await getDocs(q)

  const results: Awaken[] = []
  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, ...(doc.data() as Omit<Awaken, "id">) })
  })

  return results
}

export const useGetAllAwaken = () => {
  const { data: awaken = [], isLoading, isError } = useQuery<Awaken[]>({
    queryKey: ['awaken'],
    queryFn: getAllAwaken,
  })

  return { awaken, isLoading, isError }
}
