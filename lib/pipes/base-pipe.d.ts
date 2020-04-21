import { ArgumentMetadata } from "../interfaces";
declare abstract class BasePipe {
    abstract transform(value: any, { metatype }: ArgumentMetadata): any;
}
export default BasePipe;
export declare type Pipe = typeof BasePipe;
