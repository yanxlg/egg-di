import {Application,Controller,Context} from 'egg';
import ControllerScanner from "./scanner/controller-scanner";
import {join} from 'path';
import {
    GUARDS_METADATA,
    HEADERS_METADATA,
    HTTP_CODE_METADATA,
    REDIRECT_METADATA,
    ROUTE_ARGS_METADATA,
    VALIDATOR_METADATA
} from "./constants";
import {RouteParamsFactory} from "./router-param-factory";
import * as Koa from "koa";
import MetadataContextHelper from './helpers/metadata-context-helper';
import {ControllerClass} from "./interfaces/controllers";
import {GuardsContextCreator} from "./guards/guards-context-creator";
import {GuardMap} from "./guards/guards-manager";
import {ForbiddenException} from "./exceptions";
import { FORBIDDEN_MESSAGE } from './guards/constants';


/*this.executionContextCreator = new RouterExecutionContext(
    new RouteParamsFactory(),
    new PipesContextCreator(container, config),
    new PipesConsumer(),
    new GuardsContextCreator(container, config),
    new GuardsConsumer(),
    new InterceptorsContextCreator(container, config),
    new InterceptorsConsumer(),
    container.getHttpAdapterRef(),
);*/

class Scanner {
    private app: Application;
    private controllerScanner: ControllerScanner;
    private routeParamsFactory:RouteParamsFactory;
    private metadataHelper:MetadataContextHelper;
    private guardsContextCreator:GuardsContextCreator;
    constructor(app: Application) {
        this.app = app;
        this.controllerScanner = new ControllerScanner();
        this.routeParamsFactory=new RouteParamsFactory();
        this.metadataHelper = new MetadataContextHelper(this.routeParamsFactory);
        this.guardsContextCreator = new GuardsContextCreator(this.routeParamsFactory);
        this.scanControllers();
    }

    private scanControllers() {
        const controllerList = this.controllerScanner.scanFromDir();// 此处创建
        controllerList.map((controller) => {
            const {fileName, methods, prefix,controllerClass} = controller;
            methods.map((method) => {
                const {path, requestMethod, targetCallback, methodName,} = method;
                this.app.router[requestMethod](join('/', prefix, path.join('')),this.create(controllerClass,targetCallback,methodName));
            });
        });
    }
    /**
     * 创建路由middleware
     * @param controllerClass
     * @param method
     * @param methodName
     */
    private create(
        controllerClass: ControllerClass,
        method: Function,
        methodName: string,
    ) {
       /* const contextType: ContextType = 'http';
        const {
            argsLength,
            fnHandleResponse,
            paramtypes,
            getParamsMetadata,
            httpStatusCode,
            responseHeaders,
            hasCustomHeaders,
        } = this.getMetadata(
            instance,
            callback,
            methodName,
            moduleKey,
            requestMethod,
            contextType,
        );

        const paramsOptions = this.contextUtils.mergeParamsMetatypes(
            getParamsMetadata(moduleKey, contextId, inquirerId),
            paramtypes,
        );
        const pipes = this.pipesContextCreator.create(
            instance,
            callback,
            moduleKey,
            contextId,
            inquirerId,
        );
        const guards = this.guardsContextCreator.create(
            instance,
            callback,
            moduleKey,
            contextId,
            inquirerId,
        );*/


        const guards = this.guardsContextCreator.getGuardList(controllerClass,method);
        console.log(guards);

        // 优先级，守卫 > 拦截器


       const argsMap = Reflect.getMetadata(ROUTE_ARGS_METADATA,controllerClass,methodName);
       const interceptors = this.metadataHelper.getInterceptors(controllerClass,method);
       /*
        const fnCanActivate = this.createGuardsFn(
            guards,
            instance,
            callback,
            contextType,
        );
        const fnApplyPipes = this.createPipesFn(pipes, paramsOptions);
*/
        const handler = (args: any[],next:Koa.Next,instance:Controller) => async () => {
            // fnApplyPipes && (await fnApplyPipes(args, req, res, next));
            return method.apply(instance, args);
        };

        const httpStatusCode = Reflect.getMetadata(HTTP_CODE_METADATA,method);
        const headers = Reflect.getMetadata(HEADERS_METADATA,method);

        const redirect = Reflect.getMetadata(REDIRECT_METADATA,method);


        const validators = Reflect.getMetadata(VALIDATOR_METADATA,method);


        return async (ctx:Context,next:Koa.Next) => {
            const instance = new controllerClass(ctx);

            if(validators){
                validators.map(({ruleMap,type})=>{
                   ctx.validate(ruleMap,type === 'body'?ctx.request.body:type==='params'?ctx.params:ctx.headers);
                });
            }

            if(guards && guards.length > 0){
                const canActivate = await this.guardsContextCreator.tryActivate(
                    guards,
                    ctx,
                );

                if (!canActivate) {
                    throw new ForbiddenException(FORBIDDEN_MESSAGE);
                }
            }

            const args = this.routeParamsFactory.getArgsByMap(argsMap,ctx,next);

            // ctx.res
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
            // fnCanActivate && (await fnCanActivate([req, res, next]));

            // this.responseController.setStatus(res, httpStatusCode);
            // hasCustomHeaders &&
            // this.responseController.setHeaders(res, responseHeaders);
            const handle = handler(args, next,instance);
            if(interceptors && interceptors.length>0){
                const result = await this.metadataHelper.intercept(interceptors,args,instance,handle,ctx);
                const data = await result.toPromise();
                if(data){
                    // 直接response
                    ctx.body = data;
                }
            }else{
                return await handle();
            }
        };
    }
}

export default Scanner;
