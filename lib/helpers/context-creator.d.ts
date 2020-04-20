import { ControllerClass } from "../interfaces/controllers";
declare abstract class ContextCreator {
    protected abstract createConcreteContext<T extends any[]>(metadata: T): any;
    getMetadataList<T extends any[]>(controllerClass: ControllerClass, method: Function, metadataKey: string): any[];
    reflectClassMetadata<T>(controllerClass: ControllerClass, metadataKey: string): T;
    reflectMethodMetadata<T>(callback: Function, metadataKey: string): T;
}
export default ContextCreator;
