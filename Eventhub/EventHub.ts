type Fn = (data: unknown) => void;
class EventHub {
    private cache: { [key: string]: Array<(data: unknown) => void> } = {}
    public dispatchEvent(eventName: string, data?: unknown) {
        if (!this.cache[eventName]) return;
        this.cache[eventName].forEach(fn => fn(data));
    }
    public addEventListener(eventName: string, fn: Fn) {
        this.cache[eventName] = this.cache[eventName] || [];
        this.cache[eventName].push(fn);
    }
    public removeEventListener(eventName: string, fn: Fn) {
        if (!this.cache[eventName]) return;
        let index = this.cache[eventName].findIndex(eventFn => eventFn === fn);
        if (index === -1) return;
        this.cache[eventName].splice(index, 1);
    }
}

export default EventHub