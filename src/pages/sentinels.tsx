import { Navbar } from "@/components/shared/nav-bar";
import { Box, Button, Flex, Heading, Input, InputGroup } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";

export function Sentinels() {
    return (
        <>
            <Navbar />

            <Box margin={6}>
                <Flex justifyContent={"space-between"} my={4}>
                    <Heading mb={3}>Sentinelas</Heading>

                    <Button bg={"teal.700"} 
                    
                    //onClick={() => setIsOpen(true)}
                    >
                        Adicionar
                    </Button>
                </Flex>

                        <Flex
                          flexDirection={{ base: "column", md: "row" }}
                          alignItems={{ base: "stretch", md: "center" }}
                          gap={3}
                          marginBottom={4}
                        >
                          <InputGroup flex="1" startElement={<LuSearch />}>
                            <Input
                              placeholder="Pesquisar"
                              //value={searchQuery}
                              //onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </InputGroup>
                
                          <Button bg={"teal.600"} 
                            //onClick={handleSearchByName}
                            >
                            <FiSearch />
                          </Button>
                        </Flex>
                
            </Box>
        </>
    )
}