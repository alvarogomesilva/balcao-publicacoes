import { Box, HStack, Heading, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface SectionHeaderProps extends BoxProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  ...props
}: SectionHeaderProps) {
  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", lg: "row" }}
      alignItems={{ base: "flex-start", lg: "flex-end" }}
      justifyContent="space-between"
      gap={4}
      mb={6}
      {...props}
    >
      <Box>
        {eyebrow ? (
          <Text
            textTransform="uppercase"
            letterSpacing="0.14em"
            fontSize="xs"
            fontWeight="700"
            color="teal.700"
            mb={2}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Heading
          size={{ base: "xl", md: "2xl" }}
          color="gray.900"
          lineHeight="1.05"
          mb={description ? 2 : 0}
        >
          {title}
        </Heading>
        {description ? (
          <Text color="gray.600" maxW="720px" fontSize={{ base: "sm", md: "md" }}>
            {description}
          </Text>
        ) : null}
      </Box>

      {actions ? <HStack gap={3}>{actions}</HStack> : null}
    </Box>
  );
}
