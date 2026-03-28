import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/style.css";
import AppRouter from "./router/AppRouter.tsx";
import { AuthProvider } from "./context/react-context.tsx";

// iOS Safari viewport fix:
// window.innerHeight is the ONLY reliable source for the actual visible
// pixels on iOS — 100dvh and 100vh both resolve to the Initial Containing
// Block height in various iOS/Safari versions, which is taller than the
// visible area when the address bar or bottom toolbar is present.
const setAppHeight = () => {
  document.documentElement.style.setProperty(
    "--app-height",
    `${window.innerHeight}px`
  );
};
setAppHeight();
window.addEventListener("resize", setAppHeight);
// visualViewport fires when the keyboard appears/disappears on iOS
window.visualViewport?.addEventListener("resize", setAppHeight);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
</AuthProvider>
  </StrictMode>,
);
