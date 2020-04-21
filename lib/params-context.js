"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const route_paramtypes_enum_1 = require("./enums/route-paramtypes.enum");
const shared_utils_1 = require("./utils/shared.utils");
const metadata_context_1 = require("./metadata-context");
class ParamsContext {
    constructor(pipesContext) {
        this.pipesContext = pipesContext;
        this.getParamsMetadata = (controllerClass, methodName) => {
            const metadata = Reflect.getMetadata(constants_1.ROUTE_ARGS_METADATA, controllerClass, methodName);
            const keys = metadata ? Object.keys(metadata) : [];
            return this.exchangeKeysForValues(keys, metadata);
        };
    }
    exchangeKeyForValue(key, data, { request, params, response, query, headers, session, cookies, ip }, next) {
        switch (key) {
            case route_paramtypes_enum_1.RouteParamtypes.NEXT:
                return next;
            case route_paramtypes_enum_1.RouteParamtypes.REQUEST:
                return request;
            case route_paramtypes_enum_1.RouteParamtypes.RESPONSE:
                return response;
            case route_paramtypes_enum_1.RouteParamtypes.BODY:
                return data && request.body ? request.body[data] : request.body;
            case route_paramtypes_enum_1.RouteParamtypes.PARAM:
                return data ? params[data] : params;
            case route_paramtypes_enum_1.RouteParamtypes.QUERY:
                return data ? query[data] : query;
            case route_paramtypes_enum_1.RouteParamtypes.HEADERS:
                return data ? headers[data] : headers;
            case route_paramtypes_enum_1.RouteParamtypes.SESSION:
                return session;
            case route_paramtypes_enum_1.RouteParamtypes.FILE:
                return request[data || 'file'];
            case route_paramtypes_enum_1.RouteParamtypes.FILES:
                return request.files;
            case route_paramtypes_enum_1.RouteParamtypes.IP:
                return ip;
            case route_paramtypes_enum_1.RouteParamtypes.Cookie:
                return data ? cookies.get(data) : undefined;
            default:
                return undefined;
        }
    }
    getArgsByMap(metadataKeys, context, next) {
        let args = [];
        if (metadataKeys) {
            // parse
            for (let key in metadataKeys) {
                const parasType = Number(key.split(":")[0]);
                const { index, data } = metadataKeys[key];
                args[index] = this.exchangeKeyForValue(parasType, data, context, next);
            }
        }
        return args;
    }
    mergeParamsMetatypes(paramsProperties, paramtypes) {
        if (!paramtypes) {
            return paramsProperties;
        }
        return paramsProperties.map((param) => (Object.assign(Object.assign({}, param), { metatype: paramtypes[param.index] })));
    }
    isPipeable(type) {
        return (type === route_paramtypes_enum_1.RouteParamtypes.BODY ||
            type === route_paramtypes_enum_1.RouteParamtypes.QUERY ||
            type === route_paramtypes_enum_1.RouteParamtypes.PARAM ||
            shared_utils_1.isString(type));
    }
    async getParamValue(value, { metatype, type, data }, pipes) {
        if (!shared_utils_1.isEmpty(pipes)) {
            return this.pipesContext.apply(value, { metatype, type, data }, pipes);
        }
        return value;
    }
    mapParamType(key) {
        const keyPair = key.split(':');
        return keyPair[0];
    }
    exchangeKeysForValues(keys, metadata) {
        return keys.map((key) => {
            const { index, data, pipes: pipesCollection } = metadata[key];
            const pipes = this.pipesContext.createConcreteContext(pipesCollection);
            const type = this.mapParamType(key);
            // 自定义参数暂时不支持
            /*     if (key.includes(CUSTOM_ROUTE_AGRS_METADATA)) {
                     const { factory } = metadata[key];
                     const customExtractValue = this.contextUtils.getCustomFactory(
                         factory,
                         data,
                         contextFactory,
                     );
                     return { index, extractValue: customExtractValue, type, data, pipes };
                 }*/
            const numericType = Number(type);
            const extractValue = (context, next) => this.exchangeKeyForValue(numericType, data, context, next);
            return { index, extractValue, type: numericType, data, pipes };
        });
    }
    resolveParamValue(ctx, next, args, pipes) {
        return async (param) => {
            const { index, extractValue, type, data, metatype, pipes: paramPipes } = param;
            const value = extractValue(ctx, next);
            args[index] = this.isPipeable(type)
                ? await this.getParamValue(value, { metatype, type, data }, pipes.concat(paramPipes))
                : value;
        };
    }
    getParamsOptions(controllerClass, methodName) {
        const paramtypes = metadata_context_1.default.getMethodMetadata(controllerClass, methodName, constants_1.PARAMTYPES_METADATA);
        return this.mergeParamsMetatypes(this.getParamsMetadata(controllerClass, methodName), paramtypes);
    }
}
exports.default = ParamsContext;
