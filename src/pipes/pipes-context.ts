import { iterate } from 'iterare';
import {ParamsTokenFactory} from "./params-token-factory";
import {ArgumentMetadata, ControllerClass, PipeTransform} from "../interfaces";
import {RouteParamtypes} from "../enums/route-paramtypes.enum";
import ContextCreator from "../helpers/context-creator";
import {PIPES_METADATA} from "../constants";
import { isEmpty, isFunction } from '../utils/shared.utils';
import PipesManager from "./pipes-manager";

export class PipesContext extends ContextCreator {
    private readonly paramsTokenFactory = new ParamsTokenFactory();
    private interceptorManager = new PipesManager();
    constructor(
    ) {
        super();
    }

    public getPipeList<T extends any[]>(controllerClass: ControllerClass, method: Function) {
        return this.getMetadataList(controllerClass,method,PIPES_METADATA);
    }

    public createConcreteContext<T extends any[]>(
        metadata: T,
    ) {
        if (isEmpty(metadata)) {
            return [];
        }
        return iterate(metadata)
            .filter((pipe: any) => pipe && (pipe.name || pipe.transform))
            .map(pipe => this.interceptorManager.get(pipe))
            .filter(pipe => pipe && pipe.transform && isFunction(pipe.transform))
            .toArray();
    }
    /*
    public getGlobalMetadata<T extends unknown[]>(
        contextId = STATIC_CONTEXT,
        inquirerId?: string,
    ): T {
        if (!this.config) {
            return [] as T;
        }
        const globalPipes = this.config.getGlobalPipes() as T;
        if (contextId === STATIC_CONTEXT && !inquirerId) {
            return globalPipes;
        }
        const scopedPipeWrappers = this.config.getGlobalRequestPipes() as InstanceWrapper[];
        const scopedPipes = iterate(scopedPipeWrappers)
            .map(wrapper => wrapper.getInstanceByContextId(contextId, inquirerId))
            .filter(host => !!host)
            .map(host => host.instance)
            .toArray();

        return globalPipes.concat(scopedPipes) as T;
    }
*/
    public async apply<TInput = unknown>(
        value: TInput,
        { metatype, type, data }: ArgumentMetadata,
        pipes: PipeTransform[],
    ) {
        const token = this.paramsTokenFactory.exchangeEnumForString(
            (type as any) as RouteParamtypes,
        );
        return this.applyPipes(value, { metatype, type: token, data }, pipes);
    }

    public async applyPipes<TInput = unknown>(
        value: TInput,
        { metatype, type, data }: { metatype: any; type?: any; data?: any },
        transforms: PipeTransform[],
    ) {
        return transforms.reduce(async (defferedValue, pipe) => {
            const val = await defferedValue;
            const result = pipe.transform(val, { metatype, type, data });
            return result;
        }, Promise.resolve(value));
    }
}
