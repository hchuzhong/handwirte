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
    describe("对象", () => {
        it("能复制普通对象", () => {
            const a = { name: 'cz', child: { name: 'zc' } };
            const a2 = DeepClone(a);
            assert(a !== a2);
            assert(a.name === a2.name);
            assert(a.child !== a2.child);
            assert(a.child.name === a2.child.name);
        })
        it("能复制数组", () => {
            const a = [[11, 12], [21, 22], [31, 32]];
            const a2 = DeepClone(a);
            assert(a !== a2);
            assert(a[0] !== a2[0])
            assert(a[1] !== a2[1])
            assert(a[2] !== a2[2])
            assert.deepEqual(a, a2);
        })
        it("能复制函数", () => {
            const a = function (x, y) { return x + y; };
            a.xxx = { yyy: { zzz: 2 } };
            const a2 = DeepClone(a);
            assert(a !== a2);
            assert(a.xxx !== a2.xxx);
            assert(a.xxx.yyy !== a2.xxx.yyy);
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
            assert(a(1, 2) === a2(1, 2));
        })
        it("能复制环", () => {
            const a: any = { name: 'cz', child: { name: 'zc' } };
            a.self = a;
            const a2 = DeepClone(a);
            assert(a !== a2);
            assert(a.name === a2.name);
            assert(a.self !== a2.self);
        })
        // it("不会爆栈", () => {
        //     const a = { child: null };
        //     let b = a;
        //     for (let i = 0; i < 20000; i++) {
        //         b.child = { child: null };
        //         b = b.child;
        //     }
        //     const a2 = DeepClone(a);
        //     assert(a !== a2);
        //     assert(a.child !== b.child);
        // })
        it("能复制正则", () => {
            const a: any = new RegExp("hi\\d+", "gi");
            a.xxx = { yyy: { zzz: 1 } };
            const a2 = DeepClone(a);
            assert(a !== a2);
            assert(a.source === a2.source);
            assert(a.flags === a2.flags);
            assert(a.xxx !== a2.xxx);
            assert(a.xxx.yyy !== a2.xxx.yyy);
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
        })
        it("能复制日期", () => {
            const a: any = new Date();
            a.xxx = { yyy: { zzz: 1 } };
            const a2 = DeepClone(a);
            assert(a !== a2);
            assert(a.getTime() === a2.getTime());
            assert(a.xxx !== a2.xxx);
            assert(a.xxx.yyy !== a2.xxx.yyy);
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
        })
        it("能自动跳过原型属性", () => {
            const a = Object.create({ name: "a" });
            a.xxx = { yyy: { zzz: 1 } };
            const a2 = DeepClone(a);
            assert(a !== a2);
            assert.isFalse("name" in a2);
            assert(a.xxx !== a2.xxx);
            assert(a.xxx.yyy !== a2.xxx.yyy);
            assert(a.xxx.yyy.zzz === a2.xxx.yyy.zzz);
        })
        it("能复制复杂的对象", () => {
            const a = {
                n: NaN,
                n2: Infinity,
                s: "",
                bool: false,
                null: null,
                u: undefined,
                sym: Symbol(),
                o: {
                    n: NaN,
                    n2: Infinity,
                    s: "",
                    bool: false,
                    null: null,
                    u: undefined,
                    sym: Symbol()
                },
                array: [
                    {
                        n: NaN,
                        n2: Infinity,
                        s: "",
                        bool: false,
                        null: null,
                        u: undefined,
                        sym: Symbol()
                    }
                ]
            };
            const a2 = DeepClone(a);
            assert(a !== a2);
            assert.isNaN(a2.n);
            assert(a.n2 === a2.n2);
            assert(a.s === a2.s);
            assert(a.bool === a2.bool);
            assert(a.null === a2.null);
            assert(a.u === a2.u);
            assert(a.sym === a2.sym);
            assert(a.o !== a2.o);
            assert.isNaN(a2.o.n);
            assert(a.o.n2 === a2.o.n2);
            assert(a.o.s === a2.o.s);
            assert(a.o.bool === a2.o.bool);
            assert(a.o.null === a2.o.null);
            assert(a.o.u === a2.o.u);
            assert(a.o.sym === a2.o.sym);
            assert(a.array !== a2.array);
            assert(a.array[0] !== a2.array[0]);
            assert.isNaN(a2.array[0].n);
            assert(a.array[0].n2 === a2.array[0].n2);
            assert(a.array[0].s === a2.array[0].s);
            assert(a.array[0].bool === a2.array[0].bool);
            assert(a.array[0].null === a2.array[0].null);
            assert(a.array[0].u === a2.array[0].u);
            assert(a.array[0].sym === a2.array[0].sym);
        })
    })
})