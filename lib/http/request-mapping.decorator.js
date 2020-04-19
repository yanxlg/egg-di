"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const enums_1 = require("../enums");
const defaultMetadata = {
    [constants_1.PATH_METADATA]: '/',
    [constants_1.METHOD_METADATA]: enums_1.RequestMethod.GET,
};
exports.RequestMapping = (metadata = defaultMetadata) => {
    const pathMetadata = metadata[constants_1.PATH_METADATA];
    const path = pathMetadata && pathMetadata.length ? pathMetadata : '/';
    const requestMethod = metadata[constants_1.METHOD_METADATA] || enums_1.RequestMethod.GET;
    return (target, key, descriptor) => {
        Reflect.defineMetadata(constants_1.PATH_METADATA, path, descriptor.value);
        Reflect.defineMetadata(constants_1.METHOD_METADATA, requestMethod, descriptor.value);
        return descriptor;
    };
};
const createMappingDecorator = (method) => (path) => {
    return exports.RequestMapping({
        [constants_1.PATH_METADATA]: path,
        [constants_1.METHOD_METADATA]: method,
    });
};
/**
 * Route handler (method) Decorator. Routes HTTP POST requests to the specified path.
 *
 * @see [Routing](https://docs.nestjs.com/controllers#routing)
 *
 * @publicApi
 */
exports.Post = createMappingDecorator(enums_1.RequestMethod.POST);
/**
 * Route handler (method) Decorator. Routes HTTP GET requests to the specified path.
 *
 * @see [Routing](https://docs.nestjs.com/controllers#routing)
 *
 * @publicApi
 */
exports.Get = createMappingDecorator(enums_1.RequestMethod.GET);
/**
 * Route handler (method) Decorator. Routes HTTP DELETE requests to the specified path.
 *
 * @see [Routing](https://docs.nestjs.com/controllers#routing)
 *
 * @publicApi
 */
exports.Delete = createMappingDecorator(enums_1.RequestMethod.DELETE);
/**
 * Route handler (method) Decorator. Routes HTTP PUT requests to the specified path.
 *
 * @see [Routing](https://docs.nestjs.com/controllers#routing)
 *
 * @publicApi
 */
exports.Put = createMappingDecorator(enums_1.RequestMethod.PUT);
/**
 * Route handler (method) Decorator. Routes HTTP PATCH requests to the specified path.
 *
 * @see [Routing](https://docs.nestjs.com/controllers#routing)
 *
 * @publicApi
 */
exports.Patch = createMappingDecorator(enums_1.RequestMethod.PATCH);
/**
 * Route handler (method) Decorator. Routes HTTP OPTIONS requests to the specified path.
 *
 * @see [Routing](https://docs.nestjs.com/controllers#routing)
 *
 * @publicApi
 */
exports.Options = createMappingDecorator(enums_1.RequestMethod.OPTIONS);
/**
 * Route handler (method) Decorator. Routes HTTP HEAD requests to the specified path.
 *
 * @see [Routing](https://docs.nestjs.com/controllers#routing)
 *
 * @publicApi
 */
exports.Head = createMappingDecorator(enums_1.RequestMethod.HEAD);
/**
 * Route handler (method) Decorator. Routes all HTTP requests to the specified path.
 *
 * @see [Routing](https://docs.nestjs.com/controllers#routing)
 *
 * @publicApi
 */
exports.All = createMappingDecorator(enums_1.RequestMethod.ALL);
