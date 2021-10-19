import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import DeepClone from "../src/index"
chai.use(sinonChai);

const assert = chai.assert;

describe("DeepClone", () => {
    it("是一个函数", () => {
        assert.isFunction(DeepClone)
    });
    it("能复制基本类型", () => {
        const n = 123;
        const n2 = DeepClone(n);
        assert(n === n2);
        const s = 'aaa';
        const s2 = DeepClone(s);
        assert(s === s2);
        const b = true;
        const b2 = DeepClone(b);
        assert(b === b2);
        const u = undefined;
        const u2 = DeepClone(u);
        assert(u === u2);
        const empty = null;
        const empty2 = DeepClone(empty);
        assert(empty === empty2);
        const sym = Symbol();
        const sym2 = DeepClone(sym);
        assert(sym === sym2);
    })
})