import { database } from "@/lib/config"
import { useQuery } from "@tanstack/react-query"
import { collection, query, getDocs, limit } from "firebase/firestore"

interface Book {
  id: string
  active: boolean
  name: string
  code: string
  category: string
  stock: string
  createdAt: Date
}

const getAllBooks = async (): Promise<Book[]> => {
  const q = query(collection(database, "books"), limit(5))
  const querySnapshot = await getDocs(q)

  const results: Book[] = []
  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, ...(doc.data() as Omit<Book, "id">) })
  })

  return results
}

export const useGetAllBooks = () => {
  const { data: books = [], isLoading, isError } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: getAllBooks,
  })

  return { books, isLoading, isError }
}
