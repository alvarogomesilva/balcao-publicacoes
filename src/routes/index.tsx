import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import { Login } from "@/pages/login";
import { Dashboard } from "@/pages/dashboard";
import { NotFound } from "@/pages/not-found";
import { PublicRoutes } from "./public-route";
import { ProtectedRoutes } from "./protected-route";
import { Order } from "@/pages/orders";
import { Others } from "@/pages/others";
import { Sentinels } from "@/pages/sentinels";
import { Awaken } from "@/pages/awaken";
import { Home } from "@/pages/home";
import { Books } from "@/pages/books";


export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<PublicRoutes />}>
                <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<Books />}/>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/others" element={<Others />}/>
                <Route path="/sentinels" element={<Sentinels />} />
                <Route path="/awaken" element={<Awaken />} />
                <Route path="/orders" element={<Order />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </>
    )
)