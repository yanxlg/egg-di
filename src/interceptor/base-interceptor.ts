import {CallHandler} from "../interfaces";
import { Observable } from 'rxjs';
import {Context} from "egg";

abstract class BaseInterceptor{
    protected ctx: Context;// call、apply注入
    protected next: CallHandler;// call、apply注入
    abstract intercept(...args:any): Observable<any> | Promise<Observable<any>>
}

export default BaseInterceptor;

export type Interceptor = typeof BaseInterceptor;
