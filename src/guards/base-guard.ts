import {Context} from "egg";
import {Observable} from "rxjs";

abstract class BaseGuard {
    private context:Context;
    abstract canActivate(...args:any): boolean | Promise<boolean> | Observable<boolean>;
}

export default BaseGuard;


export type Guard = typeof BaseGuard;
