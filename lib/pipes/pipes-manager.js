"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PipesManager {
    constructor() {
        this.guardsMap = new Map();
    }
    get(pipe) {
        const isObject = pipe.transform;
        if (isObject) {
            // pipe实例
            const classDeclaration = pipe.constructor;
            let instance = this.guardsMap.get(classDeclaration);
            if (instance) {
                return instance;
            }
            instance = pipe;
            this.guardsMap.set(classDeclaration, instance);
            return instance;
        }
        else if (pipe.prototype && pipe.prototype.transform) {
            // pipe类
            const classDeclaration = pipe;
            let instance = this.guardsMap.get(classDeclaration);
            if (instance) {
                return instance;
            }
            instance = (new classDeclaration());
            this.guardsMap.set(classDeclaration, instance);
            return instance;
        }
        else {
            return {
                transform: pipe
            };
        }
    }
}
exports.default = PipesManager;
