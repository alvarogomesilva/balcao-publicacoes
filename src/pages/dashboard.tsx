import { Navbar } from "@/components/shared/nav-bar";
import {
    Box,
    SimpleGrid,
    Stack,
    Heading,
    Image,
} from "@chakra-ui/react";
import { Link } from "react-router";
import publicationsImg from "@/assets/publications.png";
import ordersImg from "@/assets/orders.png";
export function Dashboard() {
    return (
        <>
            <Navbar />
            
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={3} p={6} flexDirection={"column"}>
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
                            src={publicationsImg}
                            alt="Publicações"
                            objectFit="contain"
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
                            src={ordersImg}
                            alt="Publicações"
                            objectFit="contain"
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
                 
                </Link>
            </SimpleGrid>
        </>
    );
}
