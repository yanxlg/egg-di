/**
 * 元数据获取类，根据设置元数据方式调用不同的获取方式
 */
class MetadataContext {
    /**
     * 获取类上的元数据
     * @param classConstructor
     * @param metadataKey
     */
    public static getClassMetadata(classConstructor:any,metadataKey:string){
        return Reflect.getMetadata(metadataKey, classConstructor)
    }

    /**
     * 获取方法上的元数据
     * @param method
     * @param metadataKey
     */
    public static getFunctionMetadata(method:Function,metadataKey:string){
        return Reflect.getMetadata(metadataKey, method);
    }

    /**
     * 获取类上关于该成员方法的元数据
     * @param classConstructor
     * @param methodName
     * @param metadataKey
     */
    public static getMethodMetadata(classConstructor:any,methodName:string,metadataKey:string){
        return Reflect.getMetadata(metadataKey, classConstructor.prototype,methodName);
    }

    /**
     * 获取类上关于该成员方法名称的元数据
     * @param classConstructor
     * @param methodName
     * @param metadataKey
     */
    public static getClassMethodMetadata(classConstructor:any,methodName:string,metadataKey:string){
        return Reflect.getMetadata(metadataKey, classConstructor,methodName);
    }
}

export default MetadataContext;
