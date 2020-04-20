/**
 * Before 等同于前置拦截器
 * 可以使用of拦截后续操作
 * @param before
 * @constructor
 */
export declare function Before(before: Function | Function[]): MethodDecorator;
/**
 * 等同于后续拦截器
 * After通常是后续处理，不需要进行拦截
 * @param after
 * @constructor
 */
export declare function After(after: Function | Function[]): MethodDecorator & ClassDecorator;
