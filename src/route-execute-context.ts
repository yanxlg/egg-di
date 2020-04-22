import { Application, Context, Controller } from 'egg';
import { join } from 'path';
import ControllerScanner from './scanner/controller-scanner';
import InterceptorContext from './interceptor/interceptor-context';
import { GuardsContext } from './guards/guards-context';
import { PipesContext } from './pipes/pipes-context';
import { ControllerClass } from './interfaces/controllers';
import {
    HEADERS_METADATA,
    HTTP_CODE_METADATA,
    REDIRECT_METADATA,
    ROUTE_ARGS_METADATA,
} from './constants';
import * as Koa from 'koa';
import { ForbiddenException } from './exceptions';
import { FORBIDDEN_MESSAGE } from './guards/constants';
import MetadataContext from './metadata-context';
import ParamsContext from './params-context';

class RouteExecuteContext {
    private readonly controllerScanner: ControllerScanner;
    private readonly metadataHelper: InterceptorContext;
    private readonly guardsContextCreator: GuardsContext;
    private readonly pipesContext: PipesContext;
    private readonly paramsContext:ParamsContext;

    constructor(private app: Application) {
        // wait 优化
        this.controllerScanner = new ControllerScanner();
        this.pipesContext=new PipesContext();
        this.paramsContext=new ParamsContext(this.pipesContext);
        this.metadataHelper = new InterceptorContext(this.paramsContext);
        this.guardsContextCreator = new GuardsContext(this.paramsContext);
        this.scanControllers();
    }

    private scanControllers() {
        const controllerList = this.controllerScanner.create();
        controllerList.map((controller) => {
            const {methods, prefix, controllerClass } = controller;
            methods.map((method) => {
                const { path, requestMethod, targetCallback, methodName } = method;
                // middleware 自动会执行，不需要单独再次处理
                this.app.router[requestMethod](join('/', prefix, path.join('')),this.create(controllerClass, targetCallback, methodName),);
            });
        });
    }

    /**
     * 创建路由middleware
     *
     * @param controllerClass
     * @param method
     * @param methodName
     */
    private create(
        controllerClass: ControllerClass,
        method: Function,
        methodName: string,
    ) {

        const pipes = this.pipesContext.getPipeList(controllerClass,method);// 用作参数校验
        const paramsOptions = this.paramsContext.getParamsOptions(controllerClass,methodName);
        const guards = this.guardsContextCreator.getGuardList(controllerClass,method);
        const interceptors = this.metadataHelper.getInterceptors(controllerClass,method);


        // 优先级，守卫 > 拦截器
        const argsMap = MetadataContext.getClassMethodMetadata(controllerClass,methodName,ROUTE_ARGS_METADATA);
        const httpStatusCode = MetadataContext.getFunctionMetadata(method,HTTP_CODE_METADATA);
        const headers = MetadataContext.getFunctionMetadata(method,HEADERS_METADATA);
        const redirect = MetadataContext.getFunctionMetadata(method,REDIRECT_METADATA);

        const tryActive = guards && guards.length > 0? async (ctx:Context)=>{
            const canActivate = await this.guardsContextCreator.tryActivate(
                guards,
                ctx,
                method
            );
            if (!canActivate) {
                throw new ForbiddenException(FORBIDDEN_MESSAGE);
            }
        }:null;

        const pipFn = pipes && pipes.length>0?async (ctx:Context,next:Function,args:any[])=>{
            const resolveParamValue = this.paramsContext.resolveParamValue(ctx,next,args,pipes);
            await Promise.all(paramsOptions.map(resolveParamValue));
        }:null;

        const setResponseStatus = (ctx:Context)=>{
            if(httpStatusCode){
                ctx.status = httpStatusCode;
            }
            if(headers){
                headers.map(({name,value})=>{
                    ctx.set(name, value);
                })
            }
            if(redirect){
                const {url,statusCode} = redirect;
                ctx.redirect(url,statusCode);
            }
        };

        const handler = (ctx:Context,args: any[],next:Koa.Next,instance:Controller) => async () => {
            // validate & transform
            pipFn&&await pipFn(ctx,next,args);
            setResponseStatus(ctx);
            return method.apply(instance, args);
        };

        return async (ctx:Context,next:Koa.Next) => {
            const instance = new controllerClass(ctx);
            tryActive&&await tryActive(ctx);
            const args = this.paramsContext.getArgsByMap(argsMap,ctx,next);
            const handle = handler(ctx,args, next,instance);
            if(interceptors && interceptors.length>0){
                const result = await this.metadataHelper.intercept(interceptors,args,instance,handle,ctx);
                const data = await result.toPromise();
                if(data){
                    ctx.body = data;
                }
            }else{
                return await handle();
            }
        };
    }
}

export default RouteExecuteContext;
