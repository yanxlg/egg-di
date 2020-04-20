import BaseInterceptor, {Interceptor} from "../interceptor/base-interceptor";
import {ROUTE_ARGS_METADATA} from "../constants";

export declare interface InterceptorMap {
    instance: BaseInterceptor;
    argsMap?: any;
}


class InterceptorManager {
    private interceptorMap = new Map<Interceptor, InterceptorMap>();

    public get(interceptor: Function | Interceptor | BaseInterceptor) {
        const isObject = (interceptor as BaseInterceptor | { [key: string]: any }).intercept;
        if (isObject) {
            // interceptor实例
            const classDeclaration = (interceptor as BaseInterceptor).constructor as Interceptor;
            let map = this.interceptorMap.get(classDeclaration);
            if(map){
                return map;
            }
            map = {
                instance:interceptor as BaseInterceptor,
                argsMap: Reflect.getMetadata(ROUTE_ARGS_METADATA,classDeclaration,"intercept")
            };
            this.interceptorMap.set(classDeclaration,map);
            return map;
        }else if((interceptor as Interceptor|any).prototype&&(interceptor as Interceptor|any).prototype.intercept){
            // interceptor类
            const classDeclaration = (interceptor as Interceptor);
            let map = this.interceptorMap.get(classDeclaration);
            if(map){
                return map;
            }
            map = {
                instance:(new (classDeclaration as any)()) as BaseInterceptor,
                argsMap: Reflect.getMetadata(ROUTE_ARGS_METADATA,classDeclaration,"intercept")
            };
            this.interceptorMap.set(classDeclaration,map);
            return map;
        }else{
            return {
                instance:{
                    intercept:interceptor
                } as unknown as BaseInterceptor
            }
        }
    }
}

export default InterceptorManager;
