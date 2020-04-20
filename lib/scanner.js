"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_scanner_1 = require("./scanner/controller-scanner");
const path_1 = require("path");
const constants_1 = require("./constants");
const router_param_factory_1 = require("./router-param-factory");
const metadata_context_helper_1 = require("./helpers/metadata-context-helper");
const guards_context_creator_1 = require("./guards/guards-context-creator");
const exceptions_1 = require("./exceptions");
const constants_2 = require("./guards/constants");
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
    constructor(app) {
        this.app = app;
        this.controllerScanner = new controller_scanner_1.default();
        this.routeParamsFactory = new router_param_factory_1.RouteParamsFactory();
        this.metadataHelper = new metadata_context_helper_1.default(this.routeParamsFactory);
        this.guardsContextCreator = new guards_context_creator_1.GuardsContextCreator(this.routeParamsFactory);
        this.scanControllers();
    }
    scanControllers() {
        const controllerList = this.controllerScanner.scanFromDir(); // 此处创建
        controllerList.map((controller) => {
            const { fileName, methods, prefix, controllerClass } = controller;
            methods.map((method) => {
                const { path, requestMethod, targetCallback, methodName, } = method;
                this.app.router[requestMethod](path_1.join('/', prefix, path.join('')), this.create(controllerClass, targetCallback, methodName));
            });
        });
    }
    /**
     * 创建路由middleware
     * @param controllerClass
     * @param method
     * @param methodName
     */
    create(controllerClass, method, methodName) {
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
        const guards = this.guardsContextCreator.getGuardList(controllerClass, method);
        console.log(guards);
        // 优先级，守卫 > 拦截器
        const argsMap = Reflect.getMetadata(constants_1.ROUTE_ARGS_METADATA, controllerClass, methodName);
        const interceptors = this.metadataHelper.getInterceptors(controllerClass, method);
        /*
         const fnCanActivate = this.createGuardsFn(
             guards,
             instance,
             callback,
             contextType,
         );
         const fnApplyPipes = this.createPipesFn(pipes, paramsOptions);
 */
        const handler = (args, next, instance) => async () => {
            // fnApplyPipes && (await fnApplyPipes(args, req, res, next));
            return method.apply(instance, args);
        };
        const httpStatusCode = Reflect.getMetadata(constants_1.HTTP_CODE_METADATA, method);
        const headers = Reflect.getMetadata(constants_1.HEADERS_METADATA, method);
        const redirect = Reflect.getMetadata(constants_1.REDIRECT_METADATA, method);
        const validators = Reflect.getMetadata(constants_1.VALIDATOR_METADATA, method);
        return async (ctx, next) => {
            const instance = new controllerClass(ctx);
            if (validators) {
                validators.map(({ ruleMap, type }) => {
                    ctx.validate(ruleMap, type === 'body' ? ctx.request.body : type === 'params' ? ctx.params : ctx.headers);
                });
            }
            if (guards && guards.length > 0) {
                const canActivate = await this.guardsContextCreator.tryActivate(guards, ctx);
                if (!canActivate) {
                    throw new exceptions_1.ForbiddenException(constants_2.FORBIDDEN_MESSAGE);
                }
            }
            const args = this.routeParamsFactory.getArgsByMap(argsMap, ctx, next);
            // ctx.res
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
            // fnCanActivate && (await fnCanActivate([req, res, next]));
            // this.responseController.setStatus(res, httpStatusCode);
            // hasCustomHeaders &&
            // this.responseController.setHeaders(res, responseHeaders);
            const handle = handler(args, next, instance);
            if (interceptors && interceptors.length > 0) {
                const result = await this.metadataHelper.intercept(interceptors, args, instance, handle, ctx);
                const data = await result.toPromise();
                if (data) {
                    // 直接response
                    ctx.body = data;
                }
            }
            else {
                return await handle();
            }
        };
    }
}
exports.default = Scanner;
