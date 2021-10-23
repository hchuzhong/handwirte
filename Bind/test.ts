// @ts-nocheck
import bind2 from "./Bind";

Function.prototype.bind2 = bind2;
console.assert((Function.prototype as any).bind2 !== undefined);

const fn1 = function () {
    return this;
}
const newFn1 = fn1.bind2({ name: 'cz' });
console.assert(newFn1().name === 'cz', 'this');

const fn2 = function (p1, p2) {
    return [this, p1, p2];
}
const newFn2 = fn2.bind2({ name: 'cz' }, 111, 222);
console.assert(newFn2()[0].name === 'cz', 'this');
console.assert(newFn2()[1] === 111, 'p1');
console.assert(newFn2()[2] === 222, 'p2');

const anotherFn2 = fn2.bind2({ name: 'cz' }, 333);
console.assert(anotherFn2(444)[0].name === 'cz', 'this');
console.assert(anotherFn2(444)[1] === 333, 'p1');
console.assert(anotherFn2(444)[2] === 444, 'p2');