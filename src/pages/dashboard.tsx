import { Navbar } from "@/components/shared/nav-bar";
import {
    SimpleGrid,
} from "@chakra-ui/react";



export function Dashboard() {
    return (
        <>
            <Navbar />
            
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={3} p={6} flexDirection={"column"}>
             
                <h1>Tela de Dashboard</h1>
            </SimpleGrid>
        </>
    );
}