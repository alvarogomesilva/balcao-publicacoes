import { useAuthStore } from "@/store/auth-store";
import { Center, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoutes() {
    const { user, authReady } = useAuthStore();

    if (!authReady) {
        return (
            <Center minH="100vh">
                <Spinner color="teal.500" size="lg" />
            </Center>
        );
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}
