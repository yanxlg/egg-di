import {VALIDATOR_METADATA} from "../constants";
import {extendArrayMetadata} from "../utils/extend-metadata.util";

/**
 * 入参校验，需要继承egg-validate插件
 * @param ruleMap
 * @param type
 * @constructor
 */
export function Validate(ruleMap:{[key:string]:any},type:'body'|'params'|'header'='body'): MethodDecorator {
    return (
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<any>,
    ) => {
        extendArrayMetadata(VALIDATOR_METADATA, [{ ruleMap, type }], descriptor.value);
        return descriptor;
    };
}
