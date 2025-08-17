import { auth } from "@/lib/config";
import { useAuthStore } from "@/store/auth-store";
import { Box, Flex, HStack, Spacer, Text, IconButton, Heading } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { LuLogOut } from "react-icons/lu";
import { Link, useNavigate } from "react-router";

export function Navbar() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);   // Firebase desloga
            logout();              // limpa seu Zustand
            navigate("/login");    // redireciona
        } catch (err) {
            console.error("Erro ao deslogar:", err);
        }
    };

    return (
        <Box bg="white" px={6} py={3} shadow="sm" position="sticky" top={0} zIndex={10}>
            <Flex align="center">
                {/* Logo / Nome */}
                <Link to={"/"} >
                    <Heading fontSize="xl" fontWeight="bold" color="teal.500" >Balcão de Publicações</Heading>
                </Link>

                <Spacer />

                {/* Botão de logout */}
                <HStack spaceX={4} cursor={"pointer"}>
                    <LuLogOut
                        aria-label="Sair"
                        onClick={handleLogout}
                        color="red.500"

                    />
                </HStack>
            </Flex>
        </Box>
    );
}
