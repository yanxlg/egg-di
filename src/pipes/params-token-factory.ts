import { Paramtype } from '../interfaces';
import { RouteParamtypes } from '../enums/route-paramtypes.enum';

export class ParamsTokenFactory {
  public exchangeEnumForString(type: RouteParamtypes): Paramtype {
    switch (type) {
      case RouteParamtypes.BODY:
        return 'body';
      case RouteParamtypes.PARAM:
        return 'param';
      case RouteParamtypes.QUERY:
        return 'query';
      default:
        return 'custom';
    }
  }
}
