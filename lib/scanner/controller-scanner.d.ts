interface ControllerItem {
    fileName: string;
    prefix: string;
    methods: any;
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
