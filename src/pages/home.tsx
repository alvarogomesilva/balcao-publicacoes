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
import imageSentinela from '@/assets/sentinelas.png';
import imageDespertai from '@/assets/despertais.png';
import imageOutrasPublicacoes from '@/assets/outras_publicacoes.png';

import ordersImg from "@/assets/orders.png";


export function Home() {
    return (
        <>
            <Navbar />
            
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={3} p={6} flexDirection={"column"}>
                
                <Link
                    to={"/books"}

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
                            <Heading fontSize="lg">Livros</Heading>
                        </Stack>
                    </Box>

                </Link>

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

                <Link
                    to={"/sentinels"}

                >
                    <Box

                        bg="white"
                        shadow="md"
                        rounded="lg"
                        overflow="hidden"
                        _hover={{ transform: "scale(1.02)", transition: "0.2s" }}
                        cursor={"pointer"}>
                        <Image
                            src={imageSentinela}
                            alt="Publicações"
                            objectFit="contain"
                            w="full"
                            h="150px"
                        />
                        <Stack p={4}>
                            <Heading fontSize="lg">Sentinelas</Heading>
                        </Stack>
                    </Box>

                </Link>
                <Link
                    to={"/awaken"}

                >
                    <Box

                        bg="white"
                        shadow="md"
                        rounded="lg"
                        overflow="hidden"
                        _hover={{ transform: "scale(1.02)", transition: "0.2s" }}
                        cursor={"pointer"}>
                        <Image
                            src={imageDespertai}
                            alt="Publicações"
                            objectFit="contain"
                            w="full"
                            h="150px"
                        />
                        <Stack p={4}>
                            <Heading fontSize="lg">Despertais</Heading>
                        </Stack>
                    </Box>

                </Link>
                <Link
                    to={"/others"}

                >
                    <Box

                        bg="white"
                        shadow="md"
                        rounded="lg"
                        overflow="hidden"
                        _hover={{ transform: "scale(1.02)", transition: "0.2s" }}
                        cursor={"pointer"}>
                        <Image
                            src={imageOutrasPublicacoes}
                            alt="Publicações"
                            objectFit="contain"
                            w="full"
                            h="150px"
                        />
                        <Stack p={4}>
                            <Heading fontSize="lg">Outras Publicações</Heading>
                        </Stack>
                    </Box>

                </Link>

            </SimpleGrid>
        </>
    );
}