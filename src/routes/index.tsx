import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import { Login } from "@/pages/login";
import { Dashboard } from "@/pages/dashboard";
import { NotFound } from "@/pages/not-found";
import { PublicRoutes } from "./public-route";
import { ProtectedRoutes } from "./protected-route";
import { Publication } from "@/pages/publication";
import { Order } from "@/pages/orders";
import { Movements } from "@/pages/movements";


export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<PublicRoutes />}>
                <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/publications" element={<Publication />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/movements" element={<Movements />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </>
    )
)