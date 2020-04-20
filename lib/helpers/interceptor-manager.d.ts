import BaseInterceptor, { Interceptor } from "../interceptor/base-interceptor";
export declare interface InterceptorMap {
    instance: BaseInterceptor;
    argsMap?: any;
}
declare class InterceptorManager {
    private interceptorMap;
    get(interceptor: Function | Interceptor | BaseInterceptor): InterceptorMap;
}
export default InterceptorManager;
