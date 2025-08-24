import { useAuthStore } from "@/store/auth-store"
import { Navigate, Outlet } from "react-router"

export function ProtectedRoutes() {
    const { user } = useAuthStore()

    return user ? <Outlet/> : <Navigate to={"/login"} replace/>
}