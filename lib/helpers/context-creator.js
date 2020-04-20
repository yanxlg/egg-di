"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContextCreator {
    getMetadataList(controllerClass, method, metadataKey) {
        const classMetadata = this.reflectClassMetadata(controllerClass, metadataKey);
        const methodMetadata = this.reflectMethodMetadata(method, metadataKey);
        // 优先级：Class > Method
        return [
            /*     ...this.createConcreteContext<T, R>(
                    globalMetadata || ([] as T),
                    contextId,
                    inquirerId,
                ),*/
            ...this.createConcreteContext(classMetadata),
            ...this.createConcreteContext(methodMetadata),
        ];
    }
    reflectClassMetadata(controllerClass, metadataKey) {
        return Reflect.getMetadata(metadataKey, controllerClass);
    }
    reflectMethodMetadata(callback, metadataKey) {
        return Reflect.getMetadata(metadataKey, callback);
    }
}
exports.default = ContextCreator;
