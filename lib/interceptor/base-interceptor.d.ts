import { CallHandler } from "../interfaces";
import { Observable } from 'rxjs';
import { Context } from "egg";
declare abstract class BaseInterceptor {
    protected ctx: Context;
    protected next: CallHandler;
    abstract intercept(...args: any): Observable<any> | Promise<Observable<any>>;
}
export default BaseInterceptor;
export declare type Interceptor = typeof BaseInterceptor;
