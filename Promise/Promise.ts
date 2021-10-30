class Promise2 {
    public state = "pending";
    private callbacks = [];

    constructor(fn) {
        if (typeof fn !== "function") {
            throw new Error("promise 的构造函数的参数只接受函数");
        }
        fn(this.resolve.bind(this), this.reject.bind(this));
    }

    private resolveOrReject(state, data, i) {
        nextTick(() => {
            if (this.state !== "pending") return;
            this.state = state;
            this.callbacks.forEach((handle) => {
                if (typeof handle[i] === "function") {
                    let x;
                    try {
                        x = handle[i].call(undefined, data);
                    } catch (e) {
                        return handle[2].reject(e);
                    }
                    handle[2].resolveWith(x);
                }
            });
        });
    }

    public resolve(result) {
        this.resolveOrReject("fulfilled", result, 0);
    }

    public reject(reason) {
        this.resolveOrReject("rejected", reason, 1);
    }

    public then(succeed?, fail?) {
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

    private resolveWithSelf() {
        this.reject(new TypeError());
    }

    private resolveWithPromise(x) {
        x.then(
            (result) => {
                this.resolve(result);
            },
            (reason) => {
                this.reject(reason);
            }
        );
    }

    private getThen(x) {
        let then;
        try {
            then = x.then;
        } catch (e) {
            return this.reject(e);
        }
        return then;
    }

    private resolveWithThenable(x) {
        try {
            x.then(
                (y) => {
                    this.resolveWith(y);
                },
                (r) => {
                    this.reject(r);
                }
            );
        } catch (e) {
            this.reject(e);
        }
    }

    private resolveWithObject(x) {
        let then = this.getThen(x);
        if (then instanceof Function) {
            this.resolveWithThenable(x);
        } else {
            this.resolve(x);
        }
    }

    private resolveWith(x) {
        if (this === x) {
            this.resolveWithSelf();
        } else if (x instanceof Promise2) {
            this.resolveWithPromise(x);
        } else if (x instanceof Object) {
            this.resolveWithObject(x);
        } else {
            this.resolve(x);
        }
    }
}

export default Promise2;

function nextTick(fn) {
    if (process !== undefined && typeof process.nextTick === "function") {
        return process.nextTick(fn);
    } else {
        var counter = 1;
        var observer = new MutationObserver(fn);
        var textNode = document.createTextNode(String(counter));

        observer.observe(textNode, {
            characterData: true,
        });

        counter += 1;
        textNode.data = String(counter);
    }
}
