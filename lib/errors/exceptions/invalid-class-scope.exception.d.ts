import { Abstract, Type } from '../../interfaces';
import { RuntimeException } from './runtime.exception';
export declare class InvalidClassScopeException extends RuntimeException {
    constructor(metatypeOrToken: Type<any> | Abstract<any> | string | symbol);
}
