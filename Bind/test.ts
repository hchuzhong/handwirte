// @ts-nocheck
import bind2 from "./Bind";
Function.prototype.bind2 = bind2;

test1('fn.bind 能用');
test2('this 绑定成功');
test3('this, p1, p2 绑定成功');
test4('this, p1 绑定成功, 后面传 p2 绑定成功');
test5('new 的时候绑定了 p1, p2');
test6('new 的时候绑定了 p1, p2; 原型上的属性也能绑定');
test7('用类似于 new 的对象');

function test1(message) {
    console.log(message);
    console.assert((Function.prototype as any).bind2 !== undefined);
}

function test2(message) {
    console.log(message);
    const fn1 = function () {
        return this;
    }
    const newFn1 = fn1.bind2({ name: 'cz' });
    console.assert(newFn1().name === 'cz', 'this');
}

function test3(message) {
    console.log(message);
    const fn2 = function (p1, p2) {
        return [this, p1, p2];
    }
    const newFn2 = fn2.bind2({ name: 'cz' }, 111, 222);
    console.assert(newFn2()[0].name === 'cz', 'this');
    console.assert(newFn2()[1] === 111, 'p1');
    console.assert(newFn2()[2] === 222, 'p2');
}

function test4(message) {
    console.log(message);
    const fn2 = function (p1, p2) {
        return [this, p1, p2];
    }
    const anotherFn2 = fn2.bind2({ name: 'cz' }, 333);
    console.assert(anotherFn2(444)[0].name === 'cz', 'this');
    console.assert(anotherFn2(444)[1] === 333, 'p1');
    console.assert(anotherFn2(444)[2] === 444, 'p2');
}

function test5(message) {
    console.log(message);
    const fn = function (p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    const fn2 = fn.bind2(undefined, 'x', 'y');
    const obj = new fn2();
    console.assert(obj.p1 === 'x', 'x');
    console.assert(obj.p2 === 'y', 'y');
}

function test6(message) {
    console.log(message);
    const fn = function (p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    fn.prototype.sayHi = function () { };
    const fn2 = fn.bind2(undefined, 'x', 'y');
    const obj = new fn2();
    console.assert(obj.p1 === 'x', 'x');
    console.assert(obj.p2 === 'y', 'y');
    // console.assert(obj.__proto__ === fn.prototype, 'prototype');
    console.assert(fn.prototype.isPrototypeOf(obj), 'prototype');
    console.assert(typeof obj.sayHi === 'function', 'bind');
}

function test7(message) {
    console.log(message);
    const fn = function (p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    fn.prototype.sayHi = function () { };
    const obj1 = new fn('z1', 'z2');
    const fn2 = fn.bind2(obj1, 'x', 'y');
    const obj = fn2();  // 没有 new
    console.assert(obj === undefined, 'undefined');
    console.assert(obj1.p1 === 'x', 'x');
    console.assert(obj1.p2 === 'y', 'y');
}