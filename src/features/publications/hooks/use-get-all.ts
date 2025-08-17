import { database } from "@/lib/config";
import { collection, query, getDocs, limit } from "firebase/firestore";
import { useState, useEffect } from "react";

interface Publication {
  id: string
  name: string
  code: string
  createdAt: Date
}

export const useGetAllPublications = () => {
  const [publications, setPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const getAllPublications = async () => {
      setIsLoading(true)
      try {
        const q = query(collection(database, "publications"), limit(3))
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

    getAllPublications()
  }, [])

  return { publications, isLoading }
}
