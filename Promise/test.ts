import { doesNotReject } from "assert";
import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import Promise from "./Promise";
chai.use(sinonChai);

const assert = chai.assert;

describe("Promise", () => {
    it("是一个类", () => {
        assert.isFunction(Promise);
        assert.isObject(Promise.prototype);
    });
    it("new Promise() 必须接受一个函数", () => {
        assert.throw(() => {
            // @ts-ignore
            new Promise(111);
        });
    });
    it("new Promise(fn) 会生成一个有 then 方法的对象", () => {
        const promise = new Promise(() => {});
        assert.isFunction(promise.then);
    });
    it("new Promise(fn) 中的 fn 会立即执行", () => {
        let fn = sinon.fake();
        new Promise(fn);
        assert(fn.called);
    });
    it("new Promise(fn) 中的 fn 执行的时候接受 resolve 和 reject 两个函数", (done) => {
        new Promise((resolve, reject) => {
            assert.isFunction(resolve);
            assert.isFunction(reject);
            done();
        });
    });
    it("promise.then(success) 中的 success 会在 resolve 被调用的时候执行", (done) => {
        const success = sinon.fake();
        const promise = new Promise((resolve, reject) => {
            assert.isFalse(success.called);
            resolve();
            setTimeout(() => {
                assert.isTrue(success.called);
                done();
            });
        });
        promise.then(success);
    });
    it("promise.then(null, fail) 中的 fail 会在 reject 被调用的时候执行", (done) => {
        const fail = sinon.fake();
        const promise = new Promise((resolve, reject) => {
            assert.isFalse(fail.called);
            reject();
            setTimeout(() => {
                assert.isTrue(fail.called);
                done();
            });
        });
        promise.then(null, fail);
    });
    // promise A+ 规范
    it("2.2.1", () => {
        const promise = new Promise((resolve) => {
            resolve();
        });
        promise.then(false, null);
        assert(1 === 1);
    });
    it("2.2.2", (done) => {
        const succeed = sinon.fake();
        const promise = new Promise((resolve) => {
            assert.isFalse(succeed.called);
            resolve(1111);
            resolve(2222);
            setTimeout(() => {
                assert(promise.state === "fulfilled");
                assert.isTrue(succeed.calledOnce);
                assert(succeed.calledWith(1111));
                done();
            });
        });
        promise.then(succeed);
    });
    it("2.2.3", (done) => {
        const fail = sinon.fake();
        const promise = new Promise((resolve, reject) => {
            assert.isFalse(fail.called);
            reject(1111);
            reject(2222);
            setTimeout(() => {
                assert(promise.state === "rejected");
                assert.isTrue(fail.calledOnce);
                assert(fail.calledWith(1111));
                done();
            });
        });
        promise.then(null, fail);
    });
    it("2.2.4 我的代码执行完之前不能调用 then 中成功的函数", (done) => {
        const succeed = sinon.fake();
        const promise = new Promise((resolve) => {
            resolve();
        });
        promise.then(succeed);
        console.log(1);
        assert.isFalse(succeed.called);
        setTimeout(() => {
            assert.isTrue(succeed.called);
            done();
        });
    });
    it("2.2.4 我的代码执行完之前不能调用 then 中失败的函数", (done) => {
        const fail = sinon.fake();
        const promise = new Promise((resolve, reject) => {
            reject();
        });
        promise.then(null, fail);
        console.log(1);
        assert.isFalse(fail.called);
        setTimeout(() => {
            assert.isTrue(fail.called);
            done();
        });
    });
    it("2.2.5", (done) => {
        const promise = new Promise((resolve, reject) => {
            resolve();
        });
        promise.then(function () {
            "use strict";
            assert(this === undefined);
            done();
        });
    });
    it("2.2.6.1 then 可以在一个 promise 中被多次调用", (done) => {
        const promise = new Promise((resolve, reject) => {
            resolve();
        });
        const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
        promise.then(callbacks[0]);
        promise.then(callbacks[1]);
        promise.then(callbacks[2]);
        setTimeout(() => {
            assert(callbacks[0].called);
            assert(callbacks[1].called);
            assert(callbacks[2].called);
            assert(callbacks[1].calledAfter(callbacks[0]));
            assert(callbacks[2].calledAfter(callbacks[1]));
            done();
        });
    });
    it("2.2.6.2 then 可以在一个 promise 中被多次调用", (done) => {
        const promise = new Promise((resolve, reject) => {
            reject();
        });
        const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
        promise.then(null, callbacks[0]);
        promise.then(null, callbacks[1]);
        promise.then(null, callbacks[2]);
        setTimeout(() => {
            assert(callbacks[0].called);
            assert(callbacks[1].called);
            assert(callbacks[2].called);
            assert(callbacks[1].calledAfter(callbacks[0]));
            assert(callbacks[2].calledAfter(callbacks[1]));
            done();
        });
    });
});
