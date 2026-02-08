import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router.tsx";
import { initMonitor } from "tc-monitor-react";
import { AuthProvider } from "./providers/auth/auth.tsx";
import { AbilityProvider } from "./providers/AbilityProvider.tsx";

initMonitor({
  reportUrl: 'http://localhost:3000/errorLogs/create',
  appName: 'react-mdx',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  enableBehavior: true,
  enableError: true,
  maxBreadcrumb: 10,
  enablePerformance: true,
});

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AbilityProvider>
      <RouterProvider router={router} />
    </AbilityProvider>
  </AuthProvider>
);