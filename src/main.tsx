import { Provider } from "@/components/ui/provider";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider>
    <Toaster richColors position="top-center" duration={2200} />
      <App />
  </Provider>,
);
