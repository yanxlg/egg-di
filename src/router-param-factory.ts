import { RouteParamtypes } from './enums/route-paramtypes.enum';
import { Context } from 'egg';
import * as Koa from "koa";

export class RouteParamsFactory {
    public exchangeKeyForValue(
        key: RouteParamtypes | string,
        data: string | object | any,
        {request,params,response,query,headers,session,cookies,ip}:Context,
        next:Koa.Next
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
}
