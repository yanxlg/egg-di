"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const use_interceptors_decorator_1 = require("./use-interceptors.decorator");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const beforeHook = (callback) => {
    async function before() {
        const { next } = this;
        const result = await callback.call(this);
        const isObservable = result instanceof rxjs_1.Observable;
        if (isObservable) {
            return result;
        }
        else {
            return next.handle();
        }
    }
    return before;
};
const afterHook = (callback) => {
    async function after() {
        const { next } = this;
        return next.handle().pipe(operators_1.tap(() => callback.call(this)));
    }
    return after;
};
/**
 * Before 等同于前置拦截器
 * 可以使用of拦截后续操作
 * @param before
 * @constructor
 */
function Before(before) {
    const fns = Array.isArray(before) ? before : [before];
    return use_interceptors_decorator_1.UseInterceptors(...fns.map(before => beforeHook(before)));
}
exports.Before = Before;
/**
 * 等同于后续拦截器
 * After通常是后续处理，不需要进行拦截
 * @param after
 * @constructor
 */
function After(after) {
    const fns = Array.isArray(after) ? after : [after];
    return use_interceptors_decorator_1.UseInterceptors(...fns.map(after => afterHook(after)));
}
exports.After = After;
