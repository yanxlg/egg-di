import { Application } from 'egg';
declare class Scanner {
    private app;
    private controllerScanner;
    private routeParamsFactory;
    private metadataHelper;
    private guardsContextCreator;
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
export default Scanner;
