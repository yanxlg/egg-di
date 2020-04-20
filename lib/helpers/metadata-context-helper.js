"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_utils_1 = require("../utils/shared.utils");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const iterare_1 = require("iterare");
const interceptor_manager_1 = require("./interceptor-manager");
const context_creator_1 = require("./context-creator");
const constants_1 = require("../constants");
class MetadataContextHelper extends context_creator_1.default {
    constructor(routeParamsFactory) {
        super();
        this.interceptorManager = new interceptor_manager_1.default();
        this.routeParamsFactory = routeParamsFactory;
    }
    createConcreteContext(metadata) {
        if (shared_utils_1.isEmpty(metadata)) {
            return [];
        }
        return iterare_1.default(metadata)
            .filter(interceptor => interceptor && (interceptor.name || interceptor.intercept))
            .map(interceptor => this.interceptorManager.get(interceptor))
            .filter((interceptorMap) => {
            return (interceptorMap && interceptorMap.instance && shared_utils_1.isFunction(interceptorMap.instance.intercept));
        })
            .toArray();
    }
    getInterceptors(controllerClass, method) {
        return this.getMetadataList(controllerClass, method, constants_1.INTERCEPTORS_METADATA);
    }
    transformDeffered(next) {
        return rxjs_1.from(next()).pipe(operators_1.switchMap(res => {
            const isDeffered = res instanceof Promise || res instanceof rxjs_1.Observable;
            return isDeffered ? res : Promise.resolve(res);
        }));
    }
    intercept(interceptors, args, instance, next, context) {
        const start$ = rxjs_1.defer(() => this.transformDeffered(next));
        const nextFn = (i = 0) => async () => {
            if (i >= interceptors.length) {
                return start$;
            }
            const handler = {
                handle: () => rxjs_1.from(nextFn(i + 1)()).pipe(operators_1.mergeAll()),
            };
            const { instance, argsMap } = interceptors[i];
            const args = this.routeParamsFactory.getArgsByMap(argsMap, context, next);
            return instance.intercept.call({
                ctx: context,
                next: handler
            }, ...args);
        };
        return nextFn()();
    }
}
exports.default = MetadataContextHelper;
