"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
function Before(before) {
    return (target, key, descriptor) => {
        const beforeQueue = Reflect.getMetadata(constants_1.BEFORE_METADATA, descriptor.value) || [];
        beforeQueue.unshift(...Array.isArray(before) ? before : [before]);
        Reflect.defineMetadata(constants_1.BEFORE_METADATA, beforeQueue, descriptor.value);
        return descriptor;
    };
}
exports.Before = Before;
function After(after) {
    return (target, key, descriptor) => {
        const afterQueue = Reflect.getMetadata(constants_1.AFTER_METADATA, descriptor.value) || [];
        afterQueue.unshift(...Array.isArray(after) ? after : [after]);
        Reflect.defineMetadata(constants_1.AFTER_METADATA, afterQueue, descriptor.value);
        return descriptor;
    };
}
exports.After = After;
