/**
 * 入参校验，需要继承egg-validate插件
 * @param ruleMap
 * @param type
 * @constructor
 */
import { UsePipes } from "./use-pipes.decorator";
import { ValidationPipe } from "../validator";

export const Validate = ()=>UsePipes(ValidationPipe);
