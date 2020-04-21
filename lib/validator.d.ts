import { ArgumentMetadata } from "./interfaces";
export declare class ValidationPipe {
    transform(value: any, { metatype }: ArgumentMetadata): Promise<any>;
    private toValidate;
}
