import {Application,Controller,Context} from 'egg';
import ControllerScanner from "./scanner/controller-scanner";
import {join} from 'path';
import {AFTER_METADATA, BEFORE_METADATA, ROUTE_ARGS_METADATA} from "./constants";
import {RouteParamsFactory} from "./router-param-factory";
import * as Koa from "koa";


class Scanner {
    private app: Application;
    private controllerScanner: ControllerScanner;
    private routeParamsFactory:RouteParamsFactory;
    constructor(app: Application) {
        this.app = app;
        this.controllerScanner = new ControllerScanner();
        this.routeParamsFactory=new RouteParamsFactory();
        this.scanControllers();
    }

    private scanControllers() {
        const controllerList = this.controllerScanner.scanFromDir();
        controllerList.map((controller) => {
            const {fileName, methods, prefix,controllerClass} = controller;
            methods.map((method) => {
                const {path, requestMethod, targetCallback, methodName,} = method;
                console.log(path,methodName,requestMethod,prefix);
                //router[object.httpMethod](url, async ctx => {
                //                 // create a new Controller
                //                 const instance = new object.constructor(ctx)
                //                 //run beforeFunction
                //                 const beforeRes =
                //                     object.beforeFunction &&
                //                     (await object.beforeFunction(ctx, instance))
                //                 if (beforeRes === false) return
                //
                //                 await instance[object.handler](ctx.request.body)
                //             })

                // generate function




                this.app.router[requestMethod](join('/', prefix, path.join('')),this.generateRouteMiddleware(controllerClass,methodName));
            });
        });
    }

    private  generateRouteMiddleware(ControllerClass:Controller,methodName:string){
        console.log(methodName);
        return async (ctx:Context,next:Koa.Next) => {
            // 逻辑都是初始化的时候执行，建议前移
            // @ts-ignore
            const instance = new ControllerClass(ctx);
            const handler = instance[methodName];
            const beforeList = Reflect.getMetadata(BEFORE_METADATA,handler);
            if(beforeList && beforeList.length>0){
                for (let i =0;i<beforeList.length;i++){
                    const fn = beforeList[i];
                    const result = await fn.call(ctx);
                    if(result === false){
                        return;// 会返回404，后面考虑怎么处理
                    }
                }
            }


            const argsMap = Reflect.getMetadata(ROUTE_ARGS_METADATA,ControllerClass,methodName);
            console.log(argsMap);
            let args:any[] =[];
            if(argsMap){
                // parse
                for(let key in argsMap){
                    const parasType = Number(key.split(":")[0]);
                    const {index,data} = argsMap[key];
                    args[index] = this.routeParamsFactory.exchangeKeyForValue(parasType,data,ctx,next);
                }
            }
            const result = await handler.call(instance,...args);
            if(result === false) return;
            const afterList = Reflect.getMetadata(AFTER_METADATA,handler);
            if(afterList && afterList.length>0){
                for (let i =0;i<afterList.length;i++){
                    const result = await afterList[i]();
                    if(result === false){
                        return;// 会返回404，后面考虑怎么处理
                    }
                }
            }
        }
    }
}

export default Scanner;
