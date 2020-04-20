import BaseInterceptor, { Interceptor } from "../interceptor/base-interceptor";
/**
 * Decorator that binds interceptors to the scope of the controller or method,
 * depending on its context.
 *
 * When `@UseInterceptors` is used at the controller level, the interceptor will
 * be applied to every handler (method) in the controller.
 *
 * When `@UseInterceptors` is used at the individual handler level, the interceptor
 * will apply only to that specific method.
 *
 * @param interceptors a single interceptor instance or class, or a list of
 * interceptor instances or classes.
 *
 * @usageNotes
 * Interceptors can also be set up globally for all controllers and routes
 * using `app.useGlobalInterceptors()`.
 *
 * @publicApi
 */
export declare function UseInterceptors(...interceptors: (BaseInterceptor | Interceptor | Function)[]): MethodDecorator & ClassDecorator;
