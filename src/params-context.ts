import { ControllerClass } from './interfaces/controllers';
import { PARAMTYPES_METADATA, ROUTE_ARGS_METADATA } from './constants';
import { RouteParamtypes } from './enums/route-paramtypes.enum';
import { isEmpty, isString } from './utils/shared.utils';
import { PipeTransform } from './interfaces';
import { ParamData, RouteParamMetadata } from './http';
import { Context } from 'egg';
import { PipesContext } from './pipes/pipes-context';
import BasePipe from './pipes/base-pipe';
import MetadataContext from './metadata-context';
import * as Koa from 'koa';


export interface ParamProperties {
    index: number;
    type: RouteParamtypes | string;
    data: ParamData;
    pipes: PipeTransform[];
    extractValue: (
        context:Context,
        next: Function,
    ) => any;
}

class ParamsContext {
    constructor(
        private pipesContext: PipesContext,
    ) {}

    public exchangeKeyForValue(
        key: RouteParamtypes | string,
        data: string | object | any,
        {request,params,response,query,headers,session,cookies,ip}:Context,
        next:Koa.Next|Function
    ){
        switch (key) {
            case RouteParamtypes.NEXT:
                return next;
            case RouteParamtypes.REQUEST:
                return request;
            case RouteParamtypes.RESPONSE:
                return response;
            case RouteParamtypes.BODY:
                return data && request.body ? request.body[data] : request.body;
            case RouteParamtypes.PARAM:
                return data ? params[data] : params;
            case RouteParamtypes.QUERY:
                return data ? query[data] : query;
            case RouteParamtypes.HEADERS:
                return data ? headers[data] : headers;
            case RouteParamtypes.SESSION:
                return session;
            case RouteParamtypes.FILE:
                return request[data || 'file'];
            case RouteParamtypes.FILES:
                return request.files;
            case RouteParamtypes.IP:
                return ip;
            case RouteParamtypes.Cookie:
                return data?cookies.get(data):undefined;
            default:
                return undefined;
        }
    }

    public getArgsByMap(metadataKeys:{[key:string]:RouteParamMetadata},context:Context,next:Koa.Next){
        let args:any[] =[];
        if(metadataKeys){
            // parse
            for(let key in metadataKeys){
                const parasType = Number(key.split(":")[0]);
                const {index,data} = metadataKeys[key];
                args[index] = this.exchangeKeyForValue(parasType,data,context,next);
            }
        }
        return args;
    }

    private mergeParamsMetatypes(
        paramsProperties: ParamProperties[],
        paramtypes: any[],
    ): (ParamProperties & { metatype?: any })[] {
        if (!paramtypes) {
            return paramsProperties;
        }
        return paramsProperties.map((param) => ({
            ...param,
            metatype: paramtypes[param.index],
        }));
    }

    private getParamsMetadata = (controllerClass: ControllerClass, methodName: string) => {
        const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, controllerClass, methodName);
        const keys = metadata?Object.keys(metadata):[];
        return this.exchangeKeysForValues(keys, metadata);
    };

    private isPipeable(type: number | string): boolean {
        return (
            type === RouteParamtypes.BODY ||
            type === RouteParamtypes.QUERY ||
            type === RouteParamtypes.PARAM ||
            isString(type)
        );
    }

    private async getParamValue<T>(
        value: T,
        { metatype, type, data }: { metatype: unknown; type: RouteParamtypes; data: unknown },
        pipes: PipeTransform[],
    ): Promise<unknown> {
        if (!isEmpty(pipes)) {
            return this.pipesContext.apply(value, { metatype, type, data } as any, pipes);
        }
        return value;
    }

    private mapParamType(key: string): string {
        const keyPair = key.split(':');
        return keyPair[0];
    }

    private exchangeKeysForValues(
        keys: string[],
        metadata: Record<number, RouteParamMetadata>,
    ): ParamProperties[] {
        return keys.map((key) => {
            const { index, data, pipes: pipesCollection } = metadata[key];
            const pipes = (this.pipesContext.createConcreteContext as any)(pipesCollection);

            const type = this.mapParamType(key);
            // 自定义参数暂时不支持
            /*     if (key.includes(CUSTOM_ROUTE_AGRS_METADATA)) {
                     const { factory } = metadata[key];
                     const customExtractValue = this.contextUtils.getCustomFactory(
                         factory,
                         data,
                         contextFactory,
                     );
                     return { index, extractValue: customExtractValue, type, data, pipes };
                 }*/
            const numericType = Number(type);
            const extractValue = <TRequest, TResponse>(context: Context, next: Function) =>
                this.exchangeKeyForValue(numericType, data, context, next);
            return { index, extractValue, type: numericType, data, pipes };
        });
    }

    public resolveParamValue(ctx: Context, next: Function, args: any[], pipes: BasePipe[]) {
        return async (param: ParamProperties & { metatype?: any }) => {
            const { index, extractValue, type, data, metatype, pipes: paramPipes } = param;
            const value = extractValue(ctx, next);
            args[index] = this.isPipeable(type)
                ? await this.getParamValue(
                      value,
                      { metatype, type, data } as any,
                      pipes.concat(paramPipes),
                  )
                : value;
        };
    }

    public getParamsOptions(controllerClass:any,methodName:string){
        const paramtypes = MetadataContext.getMethodMetadata(controllerClass,methodName,PARAMTYPES_METADATA);
        return this.mergeParamsMetatypes(
            this.getParamsMetadata(controllerClass, methodName),
            paramtypes,
        );
    }
}

export default ParamsContext;
