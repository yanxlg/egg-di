"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const extend_metadata_util_1 = require("../utils/extend-metadata.util");
const shared_utils_1 = require("../utils/shared.utils");
const validate_each_util_1 = require("../utils/validate-each.util");
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
function UseInterceptors(...interceptors) {
    return (target, key, descriptor) => {
        const isInterceptorValid = (interceptor) => interceptor &&
            (shared_utils_1.isFunction(interceptor) ||
                shared_utils_1.isFunction(interceptor.intercept));
        if (descriptor) {
            validate_each_util_1.validateEach(target.constructor, interceptors, isInterceptorValid, '@UseInterceptors', 'interceptor');
            extend_metadata_util_1.extendArrayMetadata(constants_1.INTERCEPTORS_METADATA, interceptors, descriptor.value);
            return descriptor;
        }
        validate_each_util_1.validateEach(target, interceptors, isInterceptorValid, '@UseInterceptors', 'interceptor');
        extend_metadata_util_1.extendArrayMetadata(constants_1.INTERCEPTORS_METADATA, interceptors, target);
        return target;
    };
}
exports.UseInterceptors = UseInterceptors;
