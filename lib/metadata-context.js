"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 元数据获取类，根据设置元数据方式调用不同的获取方式
 */
class MetadataContext {
    /**
     * 获取类上的元数据
     * @param classConstructor
     * @param metadataKey
     */
    static getClassMetadata(classConstructor, metadataKey) {
        return Reflect.getMetadata(metadataKey, classConstructor);
    }
    /**
     * 获取方法上的元数据
     * @param method
     * @param metadataKey
     */
    static getFunctionMetadata(method, metadataKey) {
        return Reflect.getMetadata(metadataKey, method);
    }
    /**
     * 获取类上关于该成员方法的元数据
     * @param classConstructor
     * @param methodName
     * @param metadataKey
     */
    static getMethodMetadata(classConstructor, methodName, metadataKey) {
        return Reflect.getMetadata(metadataKey, classConstructor.prototype, methodName);
    }
    /**
     * 获取类上关于该成员方法名称的元数据
     * @param classConstructor
     * @param methodName
     * @param metadataKey
     */
    static getClassMethodMetadata(classConstructor, methodName, metadataKey) {
        return Reflect.getMetadata(metadataKey, classConstructor, methodName);
    }
}
exports.default = MetadataContext;
