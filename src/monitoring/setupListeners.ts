// src/monitoring/setupListeners.ts
import { eventBus } from "@/utils/eventBus";

export function setupUserBehaviorListeners() {
    // 点击监听
    document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        if (tagName === 'body') {
            return null;
        }
        const id = target.id ? ` id="${target.id}"` : '';
        const innerText = target.innerText;
        // 获取包含id、class、innerTextde字符串的标签
        let dom = `<${tagName}${id}>${innerText}</${tagName}>`;
        eventBus.emit("click", {
            type: "click",
            dom: dom
        });
    });

    // 页面跳转监听（React-Router 可监听 history）
    window.addEventListener("popstate", () => {
        eventBus.emit("route", {
            type: "route",
            url: location.pathname
        });
    });
}
