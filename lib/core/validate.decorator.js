"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const extend_metadata_util_1 = require("../utils/extend-metadata.util");
/**
 * 入参校验，需要继承egg-validate插件
 * @param ruleMap
 * @param type
 * @constructor
 */
function Validate(ruleMap, type = 'body') {
    return (target, key, descriptor) => {
        extend_metadata_util_1.extendArrayMetadata(constants_1.VALIDATOR_METADATA, [{ ruleMap, type }], descriptor.value);
        return descriptor;
    };
}
exports.Validate = Validate;
