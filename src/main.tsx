import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import "./styles/style.css";
import AppRouter from "./router/AppRouter.tsx";
import { AuthProvider } from "./context/react-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
      <Analytics />
    </AuthProvider>
  </StrictMode>,
);
