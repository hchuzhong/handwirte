function bind(asThis, ...args1) {
    const fn = this;
    return function (...args2) {
        return fn.call(asThis, ...args1, ...args2);
    }
}

export default bind

if (!Function.prototype.bind === undefined) {
    Function.prototype.bind = () => { }
}