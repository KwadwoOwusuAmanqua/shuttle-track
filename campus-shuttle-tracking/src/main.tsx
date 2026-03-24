import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./router/AppRouter.tsx";
import { AuthProvider } from "./context/react-context.tsx";
import "./index.css";
import "./styles/style.css";



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
);
