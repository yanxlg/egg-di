"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterare_1 = require("iterare");
const params_token_factory_1 = require("./params-token-factory");
const context_creator_1 = require("../helpers/context-creator");
const constants_1 = require("../constants");
const shared_utils_1 = require("../utils/shared.utils");
const pipes_manager_1 = require("./pipes-manager");
class PipesContext extends context_creator_1.default {
    constructor() {
        super();
        this.paramsTokenFactory = new params_token_factory_1.ParamsTokenFactory();
        this.interceptorManager = new pipes_manager_1.default();
    }
    getPipeList(controllerClass, method) {
        return this.getMetadataList(controllerClass, method, constants_1.PIPES_METADATA);
    }
    createConcreteContext(metadata) {
        if (shared_utils_1.isEmpty(metadata)) {
            return [];
        }
        return iterare_1.iterate(metadata)
            .filter((pipe) => pipe && (pipe.name || pipe.transform))
            .map(pipe => this.interceptorManager.get(pipe))
            .filter(pipe => pipe && pipe.transform && shared_utils_1.isFunction(pipe.transform))
            .toArray();
    }
    /*
    public getGlobalMetadata<T extends unknown[]>(
        contextId = STATIC_CONTEXT,
        inquirerId?: string,
    ): T {
        if (!this.config) {
            return [] as T;
        }
        const globalPipes = this.config.getGlobalPipes() as T;
        if (contextId === STATIC_CONTEXT && !inquirerId) {
            return globalPipes;
        }
        const scopedPipeWrappers = this.config.getGlobalRequestPipes() as InstanceWrapper[];
        const scopedPipes = iterate(scopedPipeWrappers)
            .map(wrapper => wrapper.getInstanceByContextId(contextId, inquirerId))
            .filter(host => !!host)
            .map(host => host.instance)
            .toArray();

        return globalPipes.concat(scopedPipes) as T;
    }
*/
    async apply(value, { metatype, type, data }, pipes) {
        const token = this.paramsTokenFactory.exchangeEnumForString(type);
        return this.applyPipes(value, { metatype, type: token, data }, pipes);
    }
    async applyPipes(value, { metatype, type, data }, transforms) {
        return transforms.reduce(async (defferedValue, pipe) => {
            const val = await defferedValue;
            const result = pipe.transform(val, { metatype, type, data });
            return result;
        }, Promise.resolve(value));
    }
}
exports.PipesContext = PipesContext;
