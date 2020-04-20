import {ControllerClass} from "../interfaces/controllers";
import {INTERCEPTORS_METADATA} from "../constants";

abstract class ContextCreator {

    protected abstract createConcreteContext<T extends any[]>(
        metadata: T,
    );

    public getMetadataList<T extends any[]>(controllerClass: ControllerClass, method: Function,metadataKey:string) {
        const classMetadata = this.reflectClassMetadata<T>(controllerClass, metadataKey);
        const methodMetadata = this.reflectMethodMetadata<T>(method, metadataKey);
        // 优先级：Class > Method
        return [
            /*     ...this.createConcreteContext<T, R>(
                    globalMetadata || ([] as T),
                    contextId,
                    inquirerId,
                ),*/
            ...this.createConcreteContext<T>(classMetadata),
            ...this.createConcreteContext<T>(
                methodMetadata,
            ),
        ];
    }

    public reflectClassMetadata<T>(controllerClass: ControllerClass, metadataKey: string): T {
        return Reflect.getMetadata(metadataKey, controllerClass);
    }

    public reflectMethodMetadata<T>(
        callback: Function,
        metadataKey: string,
    ): T {
        return Reflect.getMetadata(metadataKey, callback);
    }
}

export default ContextCreator;
