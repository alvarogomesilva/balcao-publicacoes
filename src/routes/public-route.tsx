import { useAuthStore } from "@/store/auth-store"
import { Navigate, Outlet } from "react-router"

export function PublicRoutes() {
    const { user } = useAuthStore()

    return !user ? <Outlet /> : <Navigate to="/" replace /> 
}