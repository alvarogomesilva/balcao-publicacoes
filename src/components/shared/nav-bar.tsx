import { auth } from "@/lib/config";
import { useAuthStore } from "@/store/auth-store";
import { Box, Flex, HStack, Spacer, Heading } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { LuLogOut } from "react-icons/lu";
import { Link, useNavigate } from "react-router";

export function Navbar() {
    const { user } = useAuthStore()
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);   
            logout();              
            navigate("/login");    
        } catch (err) {
            console.error("Erro ao deslogar:", err);
        }
    };

    return (
        <Box bg="white" px={6} py={3} shadow="sm" position="sticky" top={0} zIndex={10}>
            <Flex align="center">
                {/* Logo / Nome */}
                <Link to={"/"} >
                    <Heading fontSize="xl" fontWeight="bold" color="teal.600" >Balcão | {user?.name}</Heading>
                </Link>

                <Spacer />

                {/* Botão de logout */}
                <HStack spaceX={4} cursor={"pointer"} color={"black"} fontSize={20}>
                    <LuLogOut
                        aria-label="Sair"
                        onClick={handleLogout}
                    />
                </HStack>
            </Flex>
        </Box>
    );
}
