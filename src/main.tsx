import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router.tsx";
import { Toaster } from "@/components/ui/sonner";
// import { AuthProvider } from "@/providers/AuthProvider copy.tsx";
// import { AbilityProvider } from "./providers/AbilityProvider";
import { setupUserBehaviorListeners } from "@/monitoring/setupListeners";
import { breadcrumb } from "@/utils/breadcrumb";
import { eventBus } from "@/utils/eventBus";
import { reportError } from "@/utils/errorReporter";
import * as rrweb from 'rrweb';
import 'rrweb-player/dist/style.css';
import type { eventWithTime } from "@rrweb/types";

export const eventsMatrix: eventWithTime[][] = [[]];

rrweb.record({
  emit(event, isCheckout) {
    // isCheckout 是一个标识，告诉你重新制作了快照
    if (isCheckout) {
      eventsMatrix.push([]);
    }
    const lastEvents = eventsMatrix[eventsMatrix.length - 1];
    lastEvents.push(event);
  },
  packFn: rrweb.pack,
  checkoutEveryNth: 50, // 每 50 个 event 重新制作快照
});


setupUserBehaviorListeners();

eventBus.on("click", (data: any) => breadcrumb.push(data));
eventBus.on("route", (data: any) => breadcrumb.push(data));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <AuthProvider>
      <AbilityProvider> */}
    <Toaster />
    <RouterProvider router={router} />
    {/* </AbilityProvider>
    </AuthProvider> */}
  </StrictMode>
);

window.addEventListener(
  'error',
  (event) => {
    const target = event.target as HTMLElement;

    // 判断是否为资源加载错误
    if (
      target &&
      (target.tagName === 'IMG' ||
        target.tagName === 'SCRIPT' ||
        target.tagName === 'LINK')
    ) {
      reportError(`资源加载失败：${target.tagName} ${(target as any).src || (target as any).href}`);
    } else {
      // JS 运行时错误
      const errorEvent = event as ErrorEvent;

      if (errorEvent.error instanceof Error) {
        // 有原始 Error 对象 → 最佳情况
        reportError(errorEvent.error);
      } else {
        // 没有 error 对象 → 构造一个
        const syntheticError = new Error(errorEvent.message);
        syntheticError.stack = `at ${errorEvent.filename}:${errorEvent.lineno}:${errorEvent.colno}`;
        reportError(syntheticError);
      }
    }
  },
  true // 必须 true 才能捕获资源加载错误
);

window.onunhandledrejection = function (event: PromiseRejectionEvent) {
  reportError(event.reason);
  // 上报或展示错误提示
};
