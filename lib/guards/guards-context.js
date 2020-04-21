"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterare_1 = require("iterare");
const context_creator_1 = require("../helpers/context-creator");
const guards_manager_1 = require("./guards-manager");
const constants_1 = require("../constants");
const shared_utils_1 = require("../utils/shared.utils");
const rxjs_1 = require("rxjs");
class GuardsContext extends context_creator_1.default {
    constructor(paramsContext) {
        super();
        this.paramsContext = paramsContext;
        this.interceptorManager = new guards_manager_1.default();
    }
    getGuardList(controllerClass, method) {
        return this.getMetadataList(controllerClass, method, constants_1.GUARDS_METADATA);
    }
    createConcreteContext(metadata) {
        if (shared_utils_1.isEmpty(metadata)) {
            return [];
        }
        return iterare_1.iterate(metadata)
            .filter((guard) => guard && (guard.name || guard.canActivate))
            .map(guard => this.interceptorManager.get(guard))
            .filter((guardMap) => {
            return (guardMap && guardMap.instance && shared_utils_1.isFunction(guardMap.instance.canActivate));
        })
            .toArray();
    }
    async tryActivate(guards, context, method) {
        if (!guards || shared_utils_1.isEmpty(guards)) {
            return true;
        }
        for (const guard of guards) {
            const args = this.paramsContext.getArgsByMap(guard.argsMap, context, undefined);
            const result = guard.instance.canActivate.call({
                context,
                handler: method
            }, ...args);
            if (await this.pickResult(result)) {
                continue;
            }
            return false;
        }
        return true;
    }
    async pickResult(result) {
        if (result instanceof rxjs_1.Observable) {
            return result.toPromise();
        }
        return result;
    }
}
exports.GuardsContext = GuardsContext;
