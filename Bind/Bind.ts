// support IE
var slice = Array.prototype.slice;
function bind(asThis) {
    var args = slice.call(arguments, 1);
    var fn = this;
    if (typeof fn !== 'function') {
        throw new Error('bind need to use by Function');
    }
    function resultFn() {
        var args2 = slice.call(arguments, 0)
        return fn.apply(resultFn.prototype.isPrototypeOf(this) ? this : asThis, args.concat(args2));
    }
    resultFn.prototype = fn.prototype;
    return resultFn;
}

// support ES6
function _bind(asThis, ...args1) {
    const fn = this;
    // this instanceof resultFn
    // or
    // resultFn.prototype.isPrototypeOf(this)
    function resultFn(...args2) {
        return fn.call(
            this instanceof resultFn ? this : asThis,
            ...args1,
            ...args2);
    }
    resultFn.prototype = fn.prototype;
    return resultFn;
}

export default _bind;