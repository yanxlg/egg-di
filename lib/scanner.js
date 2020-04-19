"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_scanner_1 = require("./scanner/controller-scanner");
const path_1 = require("path");
const constants_1 = require("./constants");
const router_param_factory_1 = require("./router-param-factory");
class Scanner {
    constructor(app) {
        this.app = app;
        this.controllerScanner = new controller_scanner_1.default();
        this.routeParamsFactory = new router_param_factory_1.RouteParamsFactory();
        this.scanControllers();
    }
    scanControllers() {
        const controllerList = this.controllerScanner.scanFromDir();
        controllerList.map((controller) => {
            const { fileName, methods, prefix, controllerClass } = controller;
            methods.map((method) => {
                const { path, requestMethod, targetCallback, methodName, } = method;
                console.log(path, methodName, requestMethod, prefix);
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
                this.app.router[requestMethod](path_1.join('/', prefix, path.join('')), this.generateRouteMiddleware(controllerClass, methodName));
            });
        });
    }
    generateRouteMiddleware(ControllerClass, methodName) {
        console.log(methodName);
        return async (ctx, next) => {
            // 逻辑都是初始化的时候执行，建议前移
            // @ts-ignore
            const instance = new ControllerClass(ctx);
            const handler = instance[methodName];
            const beforeList = Reflect.getMetadata(constants_1.BEFORE_METADATA, handler);
            if (beforeList && beforeList.length > 0) {
                for (let i = 0; i < beforeList.length; i++) {
                    const fn = beforeList[i];
                    const result = await fn.call(ctx);
                    if (result === false) {
                        return; // 会返回404，后面考虑怎么处理
                    }
                }
            }
            const argsMap = Reflect.getMetadata(constants_1.ROUTE_ARGS_METADATA, ControllerClass, methodName);
            console.log(argsMap);
            let args = [];
            if (argsMap) {
                // parse
                for (let key in argsMap) {
                    const parasType = Number(key.split(":")[0]);
                    const { index, data } = argsMap[key];
                    args[index] = this.routeParamsFactory.exchangeKeyForValue(parasType, data, ctx, next);
                }
            }
            const result = await handler.call(instance, ...args);
            if (result === false)
                return;
            const afterList = Reflect.getMetadata(constants_1.AFTER_METADATA, handler);
            if (afterList && afterList.length > 0) {
                for (let i = 0; i < afterList.length; i++) {
                    const result = await afterList[i]();
                    if (result === false) {
                        return; // 会返回404，后面考虑怎么处理
                    }
                }
            }
        };
    }
}
exports.default = Scanner;
