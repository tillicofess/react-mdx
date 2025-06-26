import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router.ts";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>
);

window.onerror = function (message, source, lineno, colno, error) {
  console.error("捕获 JS 错误:", { message, source, lineno, colno, error });
  // 可上传日志平台（如 Sentry）
};

window.onunhandledrejection = function (event) {
  console.error("捕获未处理的 Promise 错误:", event.reason);
  // 上报或展示错误提示
};
