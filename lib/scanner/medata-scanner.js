"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_utils_1 = require("../utils/shared.utils");
const iterare_1 = require("iterare");
class MetadataScanner {
    scanFromPrototype(prototype, callback) {
        const methodNames = new Set(this.getAllFilteredMethodNames(prototype));
        return iterare_1.iterate(methodNames)
            .map(callback)
            .filter(metadata => !shared_utils_1.isNil(metadata))
            .toArray();
    }
    *getAllFilteredMethodNames(prototype) {
        const isMethod = (prop) => {
            const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
            if (!descriptor || descriptor.set || descriptor.get) {
                return false;
            }
            return !shared_utils_1.isConstructor(prop) && shared_utils_1.isFunction(prototype[prop]);
        };
        do {
            yield* iterare_1.iterate(Object.getOwnPropertyNames(prototype))
                .filter(isMethod)
                .toArray();
        } while ((prototype = Reflect.getPrototypeOf(prototype)) &&
            prototype !== Object.prototype);
    }
}
exports.MetadataScanner = MetadataScanner;
exports.default = MetadataScanner;
