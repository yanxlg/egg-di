import { RouteParamtypes } from './enums/route-paramtypes.enum';
import { Context } from 'egg';
import * as Koa from "koa";
export declare class RouteParamsFactory {
    exchangeKeyForValue(key: RouteParamtypes | string, data: string | object | any, { request, params, response, query, headers, session, cookies, ip }: Context, next: Koa.Next): any;
}
