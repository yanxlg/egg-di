"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const controller_scanner_1 = require("./scanner/controller-scanner");
const interceptor_context_1 = require("./interceptor/interceptor-context");
const guards_context_1 = require("./guards/guards-context");
const pipes_context_1 = require("./pipes/pipes-context");
const constants_1 = require("./constants");
const exceptions_1 = require("./exceptions");
const constants_2 = require("./guards/constants");
const metadata_context_1 = require("./metadata-context");
const params_context_1 = require("./params-context");
class RouteExecuteContext {
    constructor(app) {
        this.app = app;
        // wait 优化
        this.controllerScanner = new controller_scanner_1.default();
        this.pipesContext = new pipes_context_1.PipesContext();
        this.paramsContext = new params_context_1.default(this.pipesContext);
        this.metadataHelper = new interceptor_context_1.default(this.paramsContext);
        this.guardsContextCreator = new guards_context_1.GuardsContext(this.paramsContext);
        this.scanControllers();
    }
    scanControllers() {
        const controllerList = this.controllerScanner.create();
        controllerList.map((controller) => {
            const { methods, prefix, controllerClass } = controller;
            methods.map((method) => {
                const { path, requestMethod, targetCallback, methodName } = method;
                // middleware 自动会执行，不需要单独再次处理
                this.app.router[requestMethod](path_1.join('/', prefix, path.join('')), this.create(controllerClass, targetCallback, methodName));
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
    create(controllerClass, method, methodName) {
        const pipes = this.pipesContext.getPipeList(controllerClass, method); // 用作参数校验
        const paramsOptions = this.paramsContext.getParamsOptions(controllerClass, methodName);
        const guards = this.guardsContextCreator.getGuardList(controllerClass, method);
        const interceptors = this.metadataHelper.getInterceptors(controllerClass, method);
        // 优先级，守卫 > 拦截器
        const argsMap = metadata_context_1.default.getClassMethodMetadata(controllerClass, methodName, constants_1.ROUTE_ARGS_METADATA);
        const httpStatusCode = metadata_context_1.default.getFunctionMetadata(method, constants_1.HTTP_CODE_METADATA);
        const headers = metadata_context_1.default.getFunctionMetadata(method, constants_1.HEADERS_METADATA);
        const redirect = metadata_context_1.default.getFunctionMetadata(method, constants_1.REDIRECT_METADATA);
        const tryActive = guards && guards.length > 0 ? async (ctx) => {
            const canActivate = await this.guardsContextCreator.tryActivate(guards, ctx, method);
            if (!canActivate) {
                throw new exceptions_1.ForbiddenException(constants_2.FORBIDDEN_MESSAGE);
            }
        } : null;
        const pipFn = pipes && pipes.length > 0 ? async (ctx, next, args) => {
            const resolveParamValue = this.paramsContext.resolveParamValue(ctx, next, args, pipes);
            await Promise.all(paramsOptions.map(resolveParamValue));
        } : null;
        const setResponseStatus = (ctx) => {
            if (httpStatusCode) {
                ctx.status = httpStatusCode;
            }
            if (headers) {
                headers.map(({ name, value }) => {
                    ctx.set(name, value);
                });
            }
            if (redirect) {
                const { url, statusCode } = redirect;
                ctx.redirect(url, statusCode);
            }
        };
        const handler = (ctx, args, next, instance) => async () => {
            // validate & transform
            pipFn && await pipFn(ctx, next, args);
            setResponseStatus(ctx);
            return method.apply(instance, args);
        };
        return async (ctx, next) => {
            const instance = new controllerClass(ctx);
            tryActive && await tryActive(ctx);
            const args = this.paramsContext.getArgsByMap(argsMap, ctx, next);
            const handle = handler(ctx, args, next, instance);
            if (interceptors && interceptors.length > 0) {
                const result = await this.metadataHelper.intercept(interceptors, args, instance, handle, ctx);
                const data = await result.toPromise();
                if (data) {
                    ctx.body = data;
                }
            }
            else {
                return await handle();
            }
        };
    }
}
exports.default = RouteExecuteContext;
