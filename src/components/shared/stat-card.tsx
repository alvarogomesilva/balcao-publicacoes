import { Box, HStack, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface StatCardProps extends BoxProps {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, helper, icon, ...props }: StatCardProps) {
  return (
    <Box
      position="relative"
      overflow="hidden"
      bg="rgba(255,255,255,0.88)"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="28px"
      px={5}
      py={5}
      shadow="0 20px 46px rgba(15, 23, 42, 0.08)"
      _before={{
        content: '""',
        position: "absolute",
        top: "-18px",
        right: "-18px",
        w: "84px",
        h: "84px",
        borderRadius: "full",
        bg: "rgba(15, 118, 110, 0.08)",
      }}
      {...props}
    >
      <HStack justify="space-between" align="flex-start" mb={4}>
        <Text fontSize="sm" fontWeight="700" color="gray.600">
          {label}
        </Text>
        <Box
          position="relative"
          zIndex={1}
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          w="40px"
          h="40px"
          borderRadius="16px"
          bg="teal.50"
        >
          {icon}
        </Box>
      </HStack>

      <Text
        position="relative"
        zIndex={1}
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="800"
        color="gray.900"
      >
        {value}
      </Text>

      {helper ? (
        <Text position="relative" zIndex={1} mt={2} fontSize="sm" color="gray.500">
          {helper}
        </Text>
      ) : null}
    </Box>
  );
}
