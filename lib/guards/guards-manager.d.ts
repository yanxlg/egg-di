import BaseGuard, { Guard } from "./base-guard";
export declare interface GuardMap {
    instance: BaseGuard;
    argsMap?: any;
}
declare class GuardsManager {
    private guardsMap;
    get(guard: Function | Guard | BaseGuard): GuardMap;
}
export default GuardsManager;
