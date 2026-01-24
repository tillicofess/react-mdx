// 发布订阅 事件总线
export class EventBus {
    private events: Record<string, Function[]> = {};

    // 添加事件 订阅者
    on(event: string, handler: Function) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(handler);
    }

    // 触发事件 发布者
    emit(event: string, payload?: any) {
        this.events[event]?.forEach(handler => handler(payload));
    }

    // 移除事件
    off(event: string, handler: Function) {
        this.events[event] = this.events[event]?.filter(fn => fn !== handler);
    }
}

export const eventBus = new EventBus();
