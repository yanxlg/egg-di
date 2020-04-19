"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALID_MIDDLEWARE_MESSAGE = (text, name) => `The middleware doesn't provide the 'use' method (${name})`;
exports.INVALID_MODULE_MESSAGE = (text, scope) => `Nest cannot create the module instance. Often, this is because of a circular dependency between modules. Use forwardRef() to avoid it.

(Read more: https://docs.nestjs.com/fundamentals/circular-dependency)
Scope [${scope}]
`;
exports.UNKNOWN_EXPORT_MESSAGE = (token = 'item', module) => {
    return `Nest cannot export a provider/module that is not a part of the currently processed module (${module}). Please verify whether the exported ${token} is available in this particular context.

Possible Solutions:
- Is ${token} part of the relevant providers/imports within ${module}?
`;
};
exports.INVALID_CLASS_MESSAGE = (text, value) => `ModuleRef cannot instantiate class (${value} is not constructable).`;
exports.INVALID_CLASS_SCOPE_MESSAGE = (text, name) => `${name || 'This class'} is marked as a scoped provider. Request and transient-scoped providers can't be used in combination with "get()" method. Please, use "resolve()" instead.`;
exports.INVALID_MIDDLEWARE_CONFIGURATION = `An invalid middleware configuration has been passed inside the module 'configure()' method.`;
exports.UNKNOWN_REQUEST_MAPPING = `An invalid controller has been detected. Perhaps, one of your controllers is missing @Controller() decorator.`;
exports.UNHANDLED_RUNTIME_EXCEPTION = `Unhandled Runtime Exception.`;
exports.INVALID_EXCEPTION_FILTER = `Invalid exception filters (@UseFilters()).`;
exports.MICROSERVICES_PACKAGE_NOT_FOUND_EXCEPTION = `Unable to load @nestjs/microservices package. (Please make sure that it's already installed.)`;
