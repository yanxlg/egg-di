import { ScopeOptions } from '../interfaces';
/**
 * Interface defining options that can be passed to `@Controller()` decorator
 *
 * @publicApi
 */
export interface ControllerOptions extends ScopeOptions {
    /**
     * Specifies an optional `route path prefix`.  The prefix is pre-pended to the
     * path specified in any request decorator in the class.
     *
     */
    path?: string;
    /**
     * Specifies an optional HTTP Request host filter.  When configured, methods
     * within the controller will only be routed if the request host matches the
     * specified value.
     *
     */
    host?: string;
}
/**
 * Decorator that marks a class as a Nest controller that can receive inbound
 * requests and produce responses.
 *
 * An HTTP Controller responds to inbound HTTP Requests and produces HTTP Responses.
 * It defines a class that provides the context for one or more related route
 * handlers that correspond to HTTP request methods and associated routes
 * for example `GET /api/profile`, `POST /user/resume`.
 *
 * A Microservice Controller responds to requests as well as events, running over
 * a variety of transports [(read more here)](https://docs.nestjs.com/microservices/basics).
 * It defines a class that provides a context for one or more message or event
 * handlers.
 *
 * @publicApi
 */
export declare function Controller(): ClassDecorator;
/**
 * Decorator that marks a class as a Nest controller that can receive inbound
 * requests and produce responses.
 *
 * An HTTP Controller responds to inbound HTTP Requests and produces HTTP Responses.
 * It defines a class that provides the context for one or more related route
 * handlers that correspond to HTTP request methods and associated routes
 * for example `GET /api/profile`, `POST /user/resume`.
 *
 * A Microservice Controller responds to requests as well as events, running over
 * a variety of transports [(read more here)](https://docs.nestjs.com/microservices/basics).
 * It defines a class that provides a context for one or more message or event
 * handlers.
 *
 * @param {string} prefix string that defines a `route path prefix`.  The prefix
 * is pre-pended to the path specified in any request decorator in the class.
 *
 * @publicApi
 */
export declare function Controller(prefix: string): ClassDecorator;
/**
 * Decorator that marks a class as a Nest controller that can receive inbound
 * requests and produce responses.
 *
 * An HTTP Controller responds to inbound HTTP Requests and produces HTTP Responses.
 * It defines a class that provides the context for one or more related route
 * handlers that correspond to HTTP request methods and associated routes
 * for example `GET /api/profile`, `POST /user/resume`.
 *
 * A Microservice Controller responds to requests as well as events, running over
 * It defines a class that provides a context for one or more message or event
 * handlers.
 *
 * @param {object} options configuration object specifying:
 *
 * - `scope` - symbol that determines the lifetime of a Controller instance.
 * more details.
 * - `prefix` - string that defines a `route path prefix`.  The prefix
 * is pre-pended to the path specified in any request decorator in the class.
 *
 * @publicApi
 */
export declare function Controller(options: ControllerOptions): ClassDecorator;
