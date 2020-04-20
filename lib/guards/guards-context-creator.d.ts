import ContextCreator from "../helpers/context-creator";
import { ControllerClass } from "../interfaces/controllers";
import { GuardMap } from "./guards-manager";
import { ContextType } from "../interfaces";
import { Observable } from "rxjs";
import { Context } from "egg";
import { RouteParamsFactory } from "../router-param-factory";
export declare class GuardsContextCreator extends ContextCreator {
    private routeParamsFactory;
    private interceptorManager;
    constructor(routeParamsFactory: RouteParamsFactory);
    getGuardList<T extends any[]>(controllerClass: ControllerClass, method: Function): any[];
    createConcreteContext<T extends any[]>(metadata: T): GuardMap[];
    tryActivate<TContext extends string = ContextType>(guards: GuardMap[], context: Context): Promise<boolean>;
    pickResult(result: boolean | Promise<boolean> | Observable<boolean>): Promise<boolean>;
}
