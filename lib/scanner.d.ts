import { Application } from 'egg';
declare class Scanner {
    private app;
    private controllerScanner;
    private routeParamsFactory;
    constructor(app: Application);
    private scanControllers;
    private generateRouteMiddleware;
}
export default Scanner;
