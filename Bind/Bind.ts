// support IE
var slice = Array.prototype.slice;
function bind(asThis) {
    var args = slice.call(arguments, 1);
    var fn = this;
    if (typeof fn !== 'function') {
        throw new Error('bind need to use by Function');
    }
    return function () {
        var args2 = slice.call(arguments, 0)
        return fn.apply(asThis, args.concat(args2));
    }
}

// support ES6
function _bind(asThis, ...args1) {
    const fn = this;
    return function (...args2) {
        return fn.call(asThis, ...args1, ...args2);
    }
}


export default bind;

if (!Function.prototype.bind === undefined) {
    Function.prototype.bind = () => { }
}