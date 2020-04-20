"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class InterceptorManager {
    constructor() {
        this.interceptorMap = new Map();
    }
    get(interceptor) {
        const isObject = interceptor.intercept;
        if (isObject) {
            // interceptor实例
            const classDeclaration = interceptor.constructor;
            let map = this.interceptorMap.get(classDeclaration);
            if (map) {
                return map;
            }
            map = {
                instance: interceptor,
                argsMap: Reflect.getMetadata(constants_1.ROUTE_ARGS_METADATA, classDeclaration, "intercept")
            };
            this.interceptorMap.set(classDeclaration, map);
            return map;
        }
        else if (interceptor.prototype && interceptor.prototype.intercept) {
            // interceptor类
            const classDeclaration = interceptor;
            let map = this.interceptorMap.get(classDeclaration);
            if (map) {
                return map;
            }
            map = {
                instance: (new classDeclaration()),
                argsMap: Reflect.getMetadata(constants_1.ROUTE_ARGS_METADATA, classDeclaration, "intercept")
            };
            this.interceptorMap.set(classDeclaration, map);
            return map;
        }
        else {
            return {
                instance: {
                    intercept: interceptor
                }
            };
        }
    }
}
exports.default = InterceptorManager;
