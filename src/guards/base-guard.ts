import {Context} from "egg";
import {Observable} from "rxjs";

abstract class BaseGuard {
    private context:Context;
    private handler:Function;// 添加当前执行具柄，支持自定义权限装饰器
    abstract canActivate(...args:any): boolean | Promise<boolean> | Observable<boolean>;
}

export default BaseGuard;


export type Guard = typeof BaseGuard;
