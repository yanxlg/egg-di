import { iterate } from 'iterare';
import ContextCreator from "../helpers/context-creator";
import {ControllerClass} from "../interfaces/controllers";
import GuardsManager, {GuardMap} from "./guards-manager";
import {GUARDS_METADATA} from "../constants";
import {isEmpty, isFunction} from "../utils/shared.utils";
import { ContextType} from "../interfaces";
import {Observable} from "rxjs";
import {Context} from "egg";
import {RouteParamsFactory} from "../router-param-factory";

export class GuardsContextCreator extends ContextCreator {
  private interceptorManager = new GuardsManager();
  constructor(
      private routeParamsFactory:RouteParamsFactory
  ) {
    super();
  }

  public getGuardList<T extends any[]>(controllerClass: ControllerClass, method: Function) {
    return this.getMetadataList(controllerClass,method,GUARDS_METADATA);
  }

  public createConcreteContext<T extends any[]>(
    metadata: T,
  ) {
    if (isEmpty(metadata)) {
      return [];
    }
    return iterate(metadata)
      .filter((guard: any) => guard && (guard.name || guard.canActivate))
      .map(guard =>
          this.interceptorManager.get(guard),
      )
        .filter((guardMap: GuardMap) =>{
          return (guardMap && guardMap.instance && isFunction(guardMap.instance.canActivate)) as boolean;
        })
      .toArray();
  }

  public async tryActivate<TContext extends string = ContextType>(
      guards: GuardMap[],
      context:Context,
  ): Promise<boolean> {
    if (!guards || isEmpty(guards)) {
      return true;
    }
    for (const guard of guards) {
      const args:any[] = this.routeParamsFactory.getArgsByMap(guard.argsMap,context,undefined as any);
      const result = guard.instance.canActivate.call(context,...args);
      if (await this.pickResult(result)) {
        continue;
      }
      return false;
    }
    return true;
  }

  public async pickResult(
      result: boolean | Promise<boolean> | Observable<boolean>,
  ): Promise<boolean> {
    if (result instanceof Observable) {
      return result.toPromise();
    }
    return result;
  }

/*  public getGlobalMetadata<T extends unknown[]>(
    contextId = STATIC_CONTEXT,
    inquirerId?: string,
  ): T {
    if (!this.config) {
      return [] as T;
    }
    const globalGuards = this.config.getGlobalGuards() as T;
    if (contextId === STATIC_CONTEXT && !inquirerId) {
      return globalGuards;
    }
    const scopedGuardWrappers = this.config.getGlobalRequestGuards() as InstanceWrapper[];
    const scopedGuards = iterate(scopedGuardWrappers)
      .map(wrapper => wrapper.getInstanceByContextId(contextId, inquirerId))
      .filter(host => !!host)
      .map(host => host.instance)
      .toArray();

    return globalGuards.concat(scopedGuards) as T;
  }*/
}
