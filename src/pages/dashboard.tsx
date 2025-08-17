// src/components/Navbar.tsx
import { Navbar } from "@/components/shared/nav-bar";
import {
    Box,
    Flex,
    HStack,
    Link as ChakraLink,
    Avatar,
    Text,
    Spacer,
    SimpleGrid,
    Stack,
    Heading,
    Image,
    LinkBox,
} from "@chakra-ui/react";
import { Link } from "react-router";
export function Dashboard() {
    return (
        <>
            <Navbar />
            
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} p={6}>
                {/* Card Publicações */}
                <Link
                    to={"/publications"}

                >
                    <Box

                        bg="white"
                        shadow="md"
                        rounded="lg"
                        overflow="hidden"
                        _hover={{ transform: "scale(1.02)", transition: "0.2s" }}
                        cursor={"pointer"}>
                        <Image
                            src="https://plus.unsplash.com/premium_photo-1669652639337-c513cc42ead6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Publicações"
                            objectFit="cover"
                            w="full"
                            h="150px"
                        />
                        <Stack p={4}>
                            <Heading fontSize="lg">Publicações</Heading>
                        </Stack>
                    </Box>

                </Link>

                {/* Card Pedidos */}
             <Link
                    to={"/orders"}

                >
                    <Box

                        bg="white"
                        shadow="md"
                        rounded="lg"
                        overflow="hidden"
                        _hover={{ transform: "scale(1.02)", transition: "0.2s" }}
                        cursor={"pointer"}>
                        <Image
                            src="https://plus.unsplash.com/premium_photo-1669652639337-c513cc42ead6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Publicações"
                            objectFit="cover"
                            w="full"
                            h="150px"
                        />
                        <Stack p={4}>
                            <Heading fontSize="lg">Pedidos</Heading>
                        </Stack>
                    </Box>

                </Link>

                {/* Card Movimentações */}
                <Link
                    to={"/movements"}

                >
                    <Box

                        bg="white"
                        shadow="md"
                        rounded="lg"
                        overflow="hidden"
                        _hover={{ transform: "scale(1.02)", transition: "0.2s" }}
                        cursor={"pointer"}>
                        <Image
                            src="https://plus.unsplash.com/premium_photo-1669652639337-c513cc42ead6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Publicações"
                            objectFit="cover"
                            w="full"
                            h="150px"
                        />
                        <Stack p={4}>
                            <Heading fontSize="lg">Movimentações</Heading>
                        </Stack>
                    </Box>

                </Link>
            </SimpleGrid>
        </>
    );
}
