import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./router/AppRouter.tsx";
import "./styles/style.css";

createRoot(document.getElementById("root")!).render(
    <AppRouter />
);
