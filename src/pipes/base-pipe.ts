import {ArgumentMetadata} from "../interfaces";

abstract class BasePipe {
    abstract transform(value, {metatype}: ArgumentMetadata): any;
}


export default BasePipe;

export type Pipe = typeof BasePipe;
