"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
function flatten(arr) {
    const flat = [].concat(...arr);
    return flat.some(Array.isArray) ? flatten(flat) : flat;
}
exports.flatten = flatten;
/**
 * Decorator that sets required dependencies (required with a vanilla JavaScript objects)
 */
exports.Dependencies = (...dependencies) => {
    const flattenDeps = flatten(dependencies);
    return (target) => {
        Reflect.defineMetadata(constants_1.PARAMTYPES_METADATA, flattenDeps, target);
    };
};
