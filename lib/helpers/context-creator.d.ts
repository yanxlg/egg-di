import { ControllerClass } from "../interfaces/controllers";
declare abstract class ContextCreator {
    protected abstract createConcreteContext<T extends any[]>(metadata: T): any;
    protected getMetadataList<T extends any[]>(controllerClass: ControllerClass, method: Function, metadataKey: string): any[];
    protected reflectClassMetadata<T>(controllerClass: ControllerClass, metadataKey: string): T;
    protected reflectMethodMetadata<T>(callback: Function, metadataKey: string): T;
}
export default ContextCreator;
