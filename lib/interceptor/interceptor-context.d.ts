import { Controller, Context } from "egg";
import { ControllerClass } from '../interfaces';
import { Observable } from 'rxjs';
import { InterceptorMap } from "./interceptor-manager";
import ContextCreator from "../helpers/context-creator";
import ParamsContext from '../params-context';
declare class InterceptorContext extends ContextCreator {
    private paramsContext;
    private interceptorManager;
    constructor(paramsContext: ParamsContext);
    protected createConcreteContext<T extends any[]>(metadata: T): InterceptorMap[];
    getInterceptors<T extends any[]>(controllerClass: ControllerClass, method: Function): any[];
    transformDeffered(next: () => Promise<any>): Observable<any>;
    intercept(interceptors: InterceptorMap[], args: unknown[], instance: Controller, next: () => Promise<unknown>, context: Context): Promise<Observable<any>>;
}
export default InterceptorContext;
