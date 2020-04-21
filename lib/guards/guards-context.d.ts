import ContextCreator from "../helpers/context-creator";
import { ControllerClass } from "../interfaces/controllers";
import { GuardMap } from "./guards-manager";
import { ContextType } from "../interfaces";
import { Observable } from "rxjs";
import { Context } from "egg";
import ParamsContext from '../params-context';
export declare class GuardsContext extends ContextCreator {
    private paramsContext;
    private interceptorManager;
    constructor(paramsContext: ParamsContext);
    getGuardList<T extends any[]>(controllerClass: ControllerClass, method: Function): any[];
    createConcreteContext<T extends any[]>(metadata: T): GuardMap[];
    tryActivate<TContext extends string = ContextType>(guards: GuardMap[], context: Context, method: Function): Promise<boolean>;
    pickResult(result: boolean | Promise<boolean> | Observable<boolean>): Promise<boolean>;
}
