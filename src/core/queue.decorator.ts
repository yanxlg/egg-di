import {
    AFTER_METADATA,
    BEFORE_METADATA,
} from '../constants';

export function Before(before: Function | Function[]): MethodDecorator {
    return (
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<any>,
    ) => {
        const beforeQueue = Reflect.getMetadata(BEFORE_METADATA, descriptor.value) || [];
        beforeQueue.unshift(...Array.isArray(before) ? before : [before]);
        Reflect.defineMetadata(BEFORE_METADATA, beforeQueue, descriptor.value);
        return descriptor;
    };
}


export function After(after: Function | Function[],) {
    return (
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<any>,
    ) => {
        const afterQueue = Reflect.getMetadata(AFTER_METADATA, descriptor.value) || [];
        afterQueue.unshift(...Array.isArray(after) ? after : [after]);
        Reflect.defineMetadata(AFTER_METADATA, afterQueue, descriptor.value);
        return descriptor;
    };
}
