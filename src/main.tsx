import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router.tsx";
import { setupUserBehaviorListeners } from "@/monitoring/setupListeners";
import { breadcrumb } from "@/utils/breadcrumb";
import { eventBus } from "@/utils/eventBus";
import { reportError } from "@/utils/errorReporter";
import * as rrweb from 'rrweb';
import 'rrweb-player/dist/style.css';
import { type eventWithTime } from "@rrweb/types";
import { type MonitorError } from "@/types/monitor";

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
  checkoutEveryNth: 30, // 每 30 个 event 重新制作快照
});


setupUserBehaviorListeners();

// 订阅点击、路由变化事件
eventBus.on("click", (data: any) => breadcrumb.push(data));
eventBus.on("route", (data: any) => breadcrumb.push(data));

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);

// 处理 JS 运行时错误
window.onerror = function (msg, source, lineno, colno, error) {
  reportError({
    category: 'js',
    type: error?.name || 'Error',
    message: String(msg),
    stack: error?.stack,
    fileName: source,
    line: lineno,
    column: colno
  } as MonitorError)
}

// 处理 Promise 未捕获拒绝错误
window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  const reason = event.reason;

  if (reason instanceof Error) {
    reportError({
      category: 'promise',
      type: reason.name,
      message: reason.message,
      stack: reason.stack
    });
  } else {
    reportError({
      category: 'promise',
      type: 'PromiseError',
      message: String(reason)
    });
  }
});

// 处理 资源 | DOM 错误
window.addEventListener(
  'error',
  (event: Event) => {
    const target = event.target as any;

    // 忽略 JS 运行时错误
    if (event instanceof ErrorEvent) {
      return;
    }

    reportError({
      category: 'resource',
      type: 'ResourceError',
      message: `资源加载失败: ${target.tagName}`,
      url: target.src || target.href,
      tagName: target.tagName
    });
  },
  true // 捕获阶段，才能拿到资源错误
);

