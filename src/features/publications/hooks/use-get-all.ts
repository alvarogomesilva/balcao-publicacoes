import { database } from "@/lib/config";
import { collection, query, getDocs, limit } from "firebase/firestore";
import { useState } from "react";

interface Publication {
  id: string
  active: boolean
  name: string
  code: string
  category: string
  stock: string
  createdAt: Date
}

export const useGetAllPublications = () => {
  const [publications, setPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const getAllPublications = async () => {
    setIsLoading(true)
    try {
      const q = query(collection(database, "publications"), limit(5))
      const querySnapshot = await getDocs(q)

      const results: any[] = []
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() })
      })

      setPublications(results)
    } catch (error) {
      console.log(error)
    }
    finally {
      setIsLoading(false)
    }
  }

  return { publications, isLoading, getAllPublications }
}
