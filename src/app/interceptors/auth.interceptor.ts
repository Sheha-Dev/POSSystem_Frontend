import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(environment.apiUrl)) {
    return next(request);
  }

  const isStateChangingRequest = !['GET', 'HEAD', 'OPTIONS'].includes(request.method.toUpperCase());
  const headers = isStateChangingRequest
    ? request.headers.set('X-Requested-With', 'XMLHttpRequest')
    : request.headers;

  return next(request.clone({ withCredentials: true, headers }));
};
