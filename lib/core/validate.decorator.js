"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 入参校验，需要继承egg-validate插件
 * @param ruleMap
 * @param type
 * @constructor
 */
const use_pipes_decorator_1 = require("./use-pipes.decorator");
const validator_1 = require("../validator");
exports.Validate = () => use_pipes_decorator_1.UsePipes(validator_1.ValidationPipe);
