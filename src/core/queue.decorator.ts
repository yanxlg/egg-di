import {UseInterceptors} from "./use-interceptors.decorator";
import {tap} from "rxjs/operators";
import {Observable} from "rxjs";

const beforeHook = (callback: Function) => {
    async function before() {
        const {next} = this;
        const result = await callback.call(this);
        const isObservable = result instanceof Observable;
        if(isObservable){
            return result;
        }else{
            return next.handle();
        }
    }
    return before as Function;
};

const afterHook = (callback: Function) => {
    async function after() {
        const {next} = this;
        return next.handle().pipe(tap( () => callback.call(this)));
    }

    return after as Function;
};


/**
 * Before 等同于前置拦截器
 * 可以使用of拦截后续操作
 * @param before
 * @constructor
 */
export function Before(before: Function | Function[]): MethodDecorator {
    const fns = Array.isArray(before) ? before : [before];
    return UseInterceptors(...fns.map(before => beforeHook(before)));
}

/**
 * 等同于后续拦截器
 * After通常是后续处理，不需要进行拦截
 * @param after
 * @constructor
 */
export function After(after: Function | Function[],) {
    const fns = Array.isArray(after) ? after : [after];
    return UseInterceptors(...fns.map(after => afterHook(after)));
}
