import {ControllerClass} from "../interfaces/controllers";

abstract class ContextCreator {

    protected abstract createConcreteContext<T extends any[]>(
        metadata: T,
    );

    protected getMetadataList<T extends any[]>(controllerClass: ControllerClass, method: Function,metadataKey:string) {
        const classMetadata = this.reflectClassMetadata<T>(controllerClass, metadataKey);
        const methodMetadata = this.reflectMethodMetadata<T>(method, metadataKey); // TODO 需要检测方法上是否生效
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

    protected reflectClassMetadata<T>(controllerClass: ControllerClass, metadataKey: string): T {
        return Reflect.getMetadata(metadataKey, controllerClass);
    }

    protected reflectMethodMetadata<T>(
        callback: Function,
        metadataKey: string,
    ): T {
        return Reflect.getMetadata(metadataKey, callback);
    }
}

export default ContextCreator;
