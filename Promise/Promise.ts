class Promise2 {
    succeed = null;
    fail = null;

    resolve() {
        setTimeout(() => {
            if (typeof this.succeed === "function") {
                this.succeed();
            }
        });
    }
    reject() {
        setTimeout(() => {
            if (typeof this.fail === "function") {
                this.fail();
            }
        });
    }

    constructor(fn) {
        if (typeof fn !== "function") {
            throw new Error("promise 的构造函数的参数只接受函数");
        }
        fn(this.resolve.bind(this), this.reject.bind(this));
    }

    then(succeed?, fail?) {
        this.succeed = succeed;
        this.fail = fail;
    }
}

export default Promise2;
