interface ControllerItem {
    fileName: string;
    prefix: string;
    methods: Array<{
        path: string[];
        requestMethod: string;
        targetCallback: Function;
        methodName: string;
    }>;
    controllerClass: any;
}
declare class ControllerScanner {
    private metadataScanner;
    constructor();
    scanFromDir(): ControllerItem[];
    private exploreControllerMetadata;
    private exploreMethodMetadata;
    private validateRoutePath;
    private scanForPaths;
}
export default ControllerScanner;
