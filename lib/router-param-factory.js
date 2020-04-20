"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_paramtypes_enum_1 = require("./enums/route-paramtypes.enum");
class RouteParamsFactory {
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
}
exports.RouteParamsFactory = RouteParamsFactory;
