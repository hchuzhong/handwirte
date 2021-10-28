class Promise2 {
    state = "pending";
    callbacks = [];

    resolve(result) {
        setTimeout(() => {
            if (this.state !== "pending") return;
            this.state = "fulfilled";
            this.callbacks.forEach((handle) => {
                if (typeof handle[0] === "function") {
                    const x = handle[0].call(undefined, result);
                    handle[2].resolveWith(x);
                }
            });
        });
    }
    reject(reason) {
        setTimeout(() => {
            if (this.state !== "pending") return;
            this.state = "rejected";
            this.callbacks.forEach((handle) => {
                if (typeof handle[1] === "function") {
                    const x = handle[1].call(undefined, reason);
                    handle[2].resolveWith(x);
                }
            });
        });
    }

    constructor(fn) {
        if (typeof fn !== "function") {
            throw new Error("promise 的构造函数的参数只接受函数");
        }
        fn(this.resolve.bind(this), this.reject.bind(this));
    }

    then(succeed?, fail?) {
        const handle = [];
        if (typeof succeed === "function") {
            handle[0] = succeed;
        }
        if (typeof fail === "function") {
            handle[1] = fail;
        }
        handle[2] = new Promise2(() => {});
        this.callbacks.push(handle);
        return handle[2];
    }
    resolveWith(x) {
        if (this === x) {
            return this.reject(new TypeError());
        }
    }
}

export default Promise2;
