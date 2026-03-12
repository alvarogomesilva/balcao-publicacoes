import { RouterProvider } from "react-router";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthSessionSync } from "@/features/auth/components/auth-session-sync";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionSync />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
