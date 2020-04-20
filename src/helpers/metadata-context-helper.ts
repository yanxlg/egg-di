import {Controller, Context} from "egg";
import {isEmpty, isFunction} from '../utils/shared.utils';
import {CallHandler, ControllerClass} from '../interfaces';
import {defer, from as fromPromise, Observable} from 'rxjs';
import {mergeAll, switchMap} from 'rxjs/operators';
import iterate from 'iterare';
import InterceptorManager, {InterceptorMap} from "./interceptor-manager";
import {RouteParamsFactory} from "../router-param-factory";
import ContextCreator from "./context-creator";
import {INTERCEPTORS_METADATA} from "../constants";

class MetadataContextHelper extends ContextCreator{
    private interceptorManager = new InterceptorManager();
    private routeParamsFactory:RouteParamsFactory;
    constructor(
        routeParamsFactory:RouteParamsFactory
    ) {
        super();
        this.routeParamsFactory=routeParamsFactory;
    }

    protected createConcreteContext<T extends any[]>(
        metadata: T,
    ): InterceptorMap[] {
        if (isEmpty(metadata)) {
            return [];
        }
        return iterate(metadata)
            .filter(
                interceptor =>
                    interceptor && (interceptor.name || interceptor.intercept),
            )
            .map(interceptor =>
                this.interceptorManager.get(interceptor),
            )
            .filter(
                (interceptorMap: InterceptorMap) =>{
                    return (interceptorMap && interceptorMap.instance && isFunction(interceptorMap.instance.intercept)) as boolean;
                },
            )
            .toArray() as InterceptorMap[];
    }


    public getInterceptors<T extends any[]>(controllerClass: ControllerClass, method: Function) {
        return this.getMetadataList(controllerClass,method,INTERCEPTORS_METADATA);
    }

    public transformDeffered(next: () => Promise<any>): Observable<any> {
        return fromPromise(next()).pipe(
            switchMap(res => {
                const isDeffered = res instanceof Promise || res instanceof Observable;
                return isDeffered ? res : Promise.resolve(res);
            }),
        );
    }

    public intercept(
            interceptors: InterceptorMap[],
            args: unknown[],
            instance: Controller,
            next: () => Promise<unknown>,
            context: Context,
        ): Promise<Observable<any>> {
        const start$ = defer(() => this.transformDeffered(next));

        const nextFn = (i = 0) => async () => {
            if (i >= interceptors.length) {
                return start$;
            }
            const handler: CallHandler = {
                handle: () => fromPromise(nextFn(i + 1)()).pipe(mergeAll()),
            };
            const {instance,argsMap} = interceptors[i];
            const args:any[] = this.routeParamsFactory.getArgsByMap(argsMap,context,next);
            return instance.intercept.call({
                ctx:context,
                next:handler
            },...args);
        };
        return nextFn()();
    }
}

export default MetadataContextHelper;
