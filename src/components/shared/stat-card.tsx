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
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="24px"
      px={5}
      py={4}
      shadow="0 18px 40px rgba(15, 23, 42, 0.06)"
      {...props}
    >
      <HStack justify="space-between" align="flex-start" mb={3}>
        <Text fontSize="sm" fontWeight="600" color="gray.600">
          {label}
        </Text>
        {icon}
      </HStack>

      <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color="gray.900">
        {value}
      </Text>

      {helper ? (
        <Text mt={2} fontSize="sm" color="gray.500">
          {helper}
        </Text>
      ) : null}
    </Box>
  );
}
