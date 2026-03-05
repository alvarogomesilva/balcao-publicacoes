import { database } from "@/lib/config"
import { useQuery } from "@tanstack/react-query"
import { collection, query, getDocs, limit } from "firebase/firestore"

interface Sentinel {
  id: string
  active: boolean
  name: string
  code: string
  category: string
  stock: string
  createdAt: Date
}

const getAllSentinelService = async (): Promise<Sentinel[]> => {
  const q = query(collection(database, "sentinels"), limit(5))
  const querySnapshot = await getDocs(q)

  const results: Sentinel[] = []
  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, ...(doc.data() as Omit<Sentinel, "id">) })
  })

  return results
}

export const useGetAllSentinels = () => {
  const { data: sentinels = [], isLoading, isError } = useQuery<Sentinel[]>({
    queryKey: ['sentinels'],
    queryFn: getAllSentinelService,
  })

  return { sentinels, isLoading, isError }
}
