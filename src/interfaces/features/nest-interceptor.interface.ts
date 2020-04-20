import { Observable } from 'rxjs';

/**
 * Interface providing access to the response stream.
 *
 * @see [Interceptors](https://docs.nestjs.com/interceptors)
 *
 * @publicApi
 */
export interface CallHandler<T = any> {
  /**
   * Returns an `Observable` representing the response stream from the route
   * handler.
   */
  handle(): Observable<T>;
}
