// src/utils/eventBus.ts
export class EventBus {
    private events: Record<string, Function[]> = {};

    on(event: string, handler: Function) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(handler);
    }

    emit(event: string, payload?: any) {
        this.events[event]?.forEach(handler => handler(payload));
    }

    off(event: string, handler: Function) {
        this.events[event] = this.events[event]?.filter(fn => fn !== handler);
    }
}

export const eventBus = new EventBus();
