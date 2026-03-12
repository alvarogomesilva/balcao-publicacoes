import { Box, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageShellProps extends BoxProps {
  children: ReactNode;
}

export function PageShell({ children, ...props }: PageShellProps) {
  return (
    <Box
      minH="calc(100vh - 72px)"
      bgGradient="linear(to-b, #f3fbf8 0%, #ffffff 35%, #eef7f4 100%)"
      px={{ base: 4, md: 6, lg: 8 }}
      py={{ base: 5, md: 7 }}
      {...props}
    >
      <Box maxW="1200px" mx="auto">
        {children}
      </Box>
    </Box>
  );
}
