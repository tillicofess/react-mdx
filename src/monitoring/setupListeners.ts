// 监听用户行为事件
import { eventBus } from "@/utils/eventBus";

const MAX_TEXT_LENGTH = 50;

function getDomPath(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const className =
        el.className && typeof el.className === 'string'
            ? '.' + el.className.split(' ').slice(0, 2).join('.')
            : '';

    return `${tag}${id}${className}`;
}


function getInnerText(el: HTMLElement): string {
    const text = el.innerText?.trim() || '';
    return text.length > MAX_TEXT_LENGTH
        ? text.slice(0, MAX_TEXT_LENGTH) + '...'
        : text;
}

export function setupUserBehaviorListeners() {
    // 点击监听
    document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (!target || target.tagName.toLowerCase() === 'body') return;

        eventBus.emit("click", {
            type: "click",
            selector: getDomPath(target),
            text: getInnerText(target),
        });
    }, true); // 用捕获阶段，保证一定能拿到

    // 路由变化监听（History API hook，兼容 React-Router）
    const rawPushState = history.pushState;
    history.pushState = function (...args) {
        rawPushState.apply(this, args);
        eventBus.emit("route", {
            type: "route",
            url: location.pathname,
        });
    };

    const rawReplaceState = history.replaceState;
    history.replaceState = function (...args) {
        rawReplaceState.apply(this, args);
        eventBus.emit("route", {
            type: "route",
            url: location.pathname,
        });
    };

    // 页面跳转监听（React-Router 可监听 history）
    window.addEventListener("popstate", () => {
        eventBus.emit("route", {
            type: "route",
            url: location.pathname,
        });
    });
}
