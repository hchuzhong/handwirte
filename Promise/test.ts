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
});
