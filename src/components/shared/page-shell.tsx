import { Box, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageShellProps extends BoxProps {
  children: ReactNode;
}

export function PageShell({ children, ...props }: PageShellProps) {
  return (
    <Box
      className="app-fade-in"
      position="relative"
      minH="calc(100vh - 72px)"
      overflow="hidden"
      bg="transparent"
      px={{ base: 4, md: 6, lg: 8 }}
      py={{ base: 5, md: 7 }}
      _before={{
        content: '""',
        position: "absolute",
        top: "-80px",
        right: "-20px",
        w: { base: "220px", md: "320px" },
        h: { base: "220px", md: "320px" },
        borderRadius: "full",
        bg: "rgba(15, 118, 110, 0.10)",
        filter: "blur(6px)",
      }}
      _after={{
        content: '""',
        position: "absolute",
        bottom: "-90px",
        left: "-10px",
        w: { base: "200px", md: "280px" },
        h: { base: "200px", md: "280px" },
        borderRadius: "full",
        bg: "rgba(245, 158, 11, 0.08)",
      }}
      {...props}
    >
      <Box position="relative" maxW="1280px" mx="auto">
        {children}
      </Box>
    </Box>
  );
}
