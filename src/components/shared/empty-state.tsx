import { Box, Button, Stack, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface EmptyStateProps extends BoxProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <Box
      borderRadius="24px"
      border="1px dashed"
      borderColor="blackAlpha.200"
      bg="rgba(248, 250, 252, 0.82)"
      px={{ base: 5, md: 7 }}
      py={{ base: 8, md: 10 }}
      textAlign="center"
      {...props}
    >
      <Stack align="center" gap={4}>
        {icon ? (
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w="56px"
            h="56px"
            borderRadius="18px"
            bg="teal.50"
            color="teal.700"
            fontSize="26px"
          >
            {icon}
          </Box>
        ) : null}

        <Stack gap={1.5} maxW="480px">
          <Text fontWeight="800" color="gray.900">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>
        </Stack>

        {action ? (
          <Button
            mt={1}
            bg="teal.600"
            color="white"
            _hover={{ bg: "teal.500" }}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}
