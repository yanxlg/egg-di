import { Observable } from "rxjs";
declare abstract class BaseGuard {
    private context;
    abstract canActivate(...args: any): boolean | Promise<boolean> | Observable<boolean>;
}
export default BaseGuard;
export declare type Guard = typeof BaseGuard;
