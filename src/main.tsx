import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router.tsx";
import initMonitor from "@/monitor/index.ts";

initMonitor({
  reportUrl: 'https://api.ticscreek.top/errorLogs/create',
  appName: 'react-mdx',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  enableBehavior: true,
  enableError: true,
  maxBreadcrumb: 10,
  enablePerformance: true,
});

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);