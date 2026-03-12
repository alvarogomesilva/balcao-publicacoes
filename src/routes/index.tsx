import { Center, Spinner } from "@chakra-ui/react";
import { Suspense, lazy, type ReactNode } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import { ProtectedRoutes } from "./protected-route";
import { PublicRoutes } from "./public-route";

const Login = lazy(async () => ({ default: (await import("@/pages/login")).Login }));
const Dashboard = lazy(async () => ({
  default: (await import("@/pages/dashboard")).Dashboard,
}));
const NotFound = lazy(async () => ({
  default: (await import("@/pages/not-found")).NotFound,
}));
const Order = lazy(async () => ({ default: (await import("@/pages/orders")).Order }));
const Others = lazy(async () => ({ default: (await import("@/pages/others")).Others }));
const Sentinels = lazy(async () => ({
  default: (await import("@/pages/sentinels")).Sentinels,
}));
const Awaken = lazy(async () => ({ default: (await import("@/pages/awaken")).Awaken }));
const Home = lazy(async () => ({ default: (await import("@/pages/home")).Home }));
const Books = lazy(async () => ({ default: (await import("@/pages/books")).Books }));

function RouteFallback() {
  return (
    <Center minH="50vh">
      <Spinner color="teal.500" size="lg" />
    </Center>
  );
}

function withSuspense(component: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{component}</Suspense>;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={withSuspense(<Login />)} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={withSuspense(<Home />)} />
        <Route path="/books" element={withSuspense(<Books />)} />
        <Route path="/dashboard" element={withSuspense(<Dashboard />)} />
        <Route path="/others" element={withSuspense(<Others />)} />
        <Route path="/sentinels" element={withSuspense(<Sentinels />)} />
        <Route path="/awaken" element={withSuspense(<Awaken />)} />
        <Route path="/orders" element={withSuspense(<Order />)} />
      </Route>

      <Route path="*" element={withSuspense(<NotFound />)} />
    </>,
  ),
);
