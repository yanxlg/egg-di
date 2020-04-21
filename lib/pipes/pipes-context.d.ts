import { ArgumentMetadata, ControllerClass, PipeTransform } from "../interfaces";
import ContextCreator from "../helpers/context-creator";
export declare class PipesContext extends ContextCreator {
    private readonly paramsTokenFactory;
    private interceptorManager;
    constructor();
    getPipeList<T extends any[]>(controllerClass: ControllerClass, method: Function): any[];
    createConcreteContext<T extends any[]>(metadata: T): {
        transform: Function | import("./base-pipe").default | typeof import("./base-pipe").default;
    }[];
    apply<TInput = unknown>(value: TInput, { metatype, type, data }: ArgumentMetadata, pipes: PipeTransform[]): Promise<any>;
    applyPipes<TInput = unknown>(value: TInput, { metatype, type, data }: {
        metatype: any;
        type?: any;
        data?: any;
    }, transforms: PipeTransform[]): Promise<any>;
}
