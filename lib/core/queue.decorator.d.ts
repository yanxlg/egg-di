export declare function Before(before: Function | Function[]): MethodDecorator;
export declare function After(after: Function | Function[]): (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
