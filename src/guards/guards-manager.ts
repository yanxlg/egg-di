import {GUARDS_METADATA, ROUTE_ARGS_METADATA} from "../constants";
import BaseGuard,{Guard} from "./base-guard";

export declare interface GuardMap {
    instance: BaseGuard;
    argsMap?: any;
}

class GuardsManager {
    private guardsMap = new Map<Guard, GuardMap>();

    public get(guard: Function | Guard | BaseGuard) {
        const isObject = (guard as BaseGuard | { [key: string]: any }).canActivate;
        if (isObject) {
            // guards实例
            const classDeclaration = (guard as BaseGuard).constructor as Guard;
            let map = this.guardsMap.get(classDeclaration);
            if(map){
                return map;
            }
            map = {
                instance:guard as BaseGuard,
                argsMap: Reflect.getMetadata(GUARDS_METADATA,classDeclaration,"canActivate")
            };
            this.guardsMap.set(classDeclaration,map);
            return map;
        }else if((guard as Guard|any).prototype&&(guard as Guard|any).prototype.canActivate){
            // guards类
            const classDeclaration = (guard as Guard);
            let map = this.guardsMap.get(classDeclaration);
            if(map){
                return map;
            }
            map = {
                instance:(new (classDeclaration as any)()) as BaseGuard,
                argsMap: Reflect.getMetadata(ROUTE_ARGS_METADATA,classDeclaration,"canActivate")
            };
            this.guardsMap.set(classDeclaration,map);
            return map;
        }else{
            return {
                instance:{
                    canActivate:guard
                } as unknown as BaseGuard
            }
        }
    }
}

export default GuardsManager;
