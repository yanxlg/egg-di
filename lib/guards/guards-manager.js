"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class GuardsManager {
    constructor() {
        this.guardsMap = new Map();
    }
    get(guard) {
        const isObject = guard.canActivate;
        if (isObject) {
            // guards实例
            const classDeclaration = guard.constructor;
            let map = this.guardsMap.get(classDeclaration);
            if (map) {
                return map;
            }
            map = {
                instance: guard,
                argsMap: Reflect.getMetadata(constants_1.GUARDS_METADATA, classDeclaration, "canActivate")
            };
            this.guardsMap.set(classDeclaration, map);
            return map;
        }
        else if (guard.prototype && guard.prototype.canActivate) {
            // guards类
            const classDeclaration = guard;
            let map = this.guardsMap.get(classDeclaration);
            if (map) {
                return map;
            }
            map = {
                instance: (new classDeclaration()),
                argsMap: Reflect.getMetadata(constants_1.ROUTE_ARGS_METADATA, classDeclaration, "canActivate")
            };
            this.guardsMap.set(classDeclaration, map);
            return map;
        }
        else {
            return {
                instance: {
                    canActivate: guard
                }
            };
        }
    }
}
exports.default = GuardsManager;
