/**
 * 元数据获取类，根据设置元数据方式调用不同的获取方式
 */
declare class MetadataContext {
    /**
     * 获取类上的元数据
     * @param classConstructor
     * @param metadataKey
     */
    static getClassMetadata(classConstructor: any, metadataKey: string): any;
    /**
     * 获取方法上的元数据
     * @param method
     * @param metadataKey
     */
    static getFunctionMetadata(method: Function, metadataKey: string): any;
    /**
     * 获取类上关于该成员方法的元数据
     * @param classConstructor
     * @param methodName
     * @param metadataKey
     */
    static getMethodMetadata(classConstructor: any, methodName: string, metadataKey: string): any;
    /**
     * 获取类上关于该成员方法名称的元数据
     * @param classConstructor
     * @param methodName
     * @param metadataKey
     */
    static getClassMethodMetadata(classConstructor: any, methodName: string, metadataKey: string): any;
}
export default MetadataContext;
