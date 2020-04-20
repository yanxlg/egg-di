/**
 * 入参校验，需要继承egg-validate插件
 * @param ruleMap
 * @param type
 * @constructor
 */
export declare function Validate(ruleMap: {
    [key: string]: any;
}, type?: 'body' | 'params' | 'header'): MethodDecorator;
