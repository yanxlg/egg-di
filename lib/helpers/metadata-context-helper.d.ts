import { Controller, Context } from "egg";
import { ControllerClass } from '../interfaces';
import { Observable } from 'rxjs';
import { InterceptorMap } from "./interceptor-manager";
import { RouteParamsFactory } from "../router-param-factory";
import ContextCreator from "./context-creator";
declare class MetadataContextHelper extends ContextCreator {
    private interceptorManager;
    private routeParamsFactory;
    constructor(routeParamsFactory: RouteParamsFactory);
    protected createConcreteContext<T extends any[]>(metadata: T): InterceptorMap[];
    getInterceptors<T extends any[]>(controllerClass: ControllerClass, method: Function): any[];
    transformDeffered(next: () => Promise<any>): Observable<any>;
    intercept(interceptors: InterceptorMap[], args: unknown[], instance: Controller, next: () => Promise<unknown>, context: Context): Promise<Observable<any>>;
}
export default MetadataContextHelper;
