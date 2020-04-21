import { RouteParamtypes } from './enums/route-paramtypes.enum';
import { PipeTransform } from './interfaces';
import { ParamData, RouteParamMetadata } from './http';
import { Context } from 'egg';
import { PipesContext } from './pipes/pipes-context';
import BasePipe from './pipes/base-pipe';
import * as Koa from 'koa';
export interface ParamProperties {
    index: number;
    type: RouteParamtypes | string;
    data: ParamData;
    pipes: PipeTransform[];
    extractValue: (context: Context, next: Function) => any;
}
declare class ParamsContext {
    private pipesContext;
    constructor(pipesContext: PipesContext);
    exchangeKeyForValue(key: RouteParamtypes | string, data: string | object | any, { request, params, response, query, headers, session, cookies, ip }: Context, next: Koa.Next | Function): any;
    getArgsByMap(metadataKeys: {
        [key: string]: RouteParamMetadata;
    }, context: Context, next: Koa.Next): any[];
    private mergeParamsMetatypes;
    private getParamsMetadata;
    private isPipeable;
    private getParamValue;
    private mapParamType;
    private exchangeKeysForValues;
    resolveParamValue(ctx: Context, next: Function, args: any[], pipes: BasePipe[]): (param: ParamProperties & {
        metatype?: any;
    }) => Promise<void>;
    getParamsOptions(controllerClass: any, methodName: string): (ParamProperties & {
        metatype?: any;
    })[];
}
export default ParamsContext;
