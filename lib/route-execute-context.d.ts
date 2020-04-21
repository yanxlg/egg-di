import { Application } from 'egg';
declare class RouteExecuteContext {
    private app;
    private readonly controllerScanner;
    private readonly metadataHelper;
    private readonly guardsContextCreator;
    private readonly pipesContext;
    private readonly paramsContext;
    constructor(app: Application);
    private scanControllers;
    /**
     * 创建路由middleware
     * @param controllerClass
     * @param method
     * @param methodName
     */
    private create;
}
export default RouteExecuteContext;
