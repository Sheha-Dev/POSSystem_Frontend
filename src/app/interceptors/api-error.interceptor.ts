import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { ApiError } from '../models/api/api-error.model';
import { AuthSessionService } from '../services/auth-session.service';
import { PopupMessageService } from '../services/popup-message.service';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const authSession = inject(AuthSessionService);
  const popupService = inject(PopupMessageService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        const isLoginRequest = request.url.endsWith('/auth/login');
        const isLogoutRequest = request.url.endsWith('/auth/logout');
        if (!isLoginRequest) {
          const wasAuthenticated = authSession.markUnauthenticated();
          if (!isLogoutRequest && !router.url.startsWith('/login') && authSession.beginLoginRedirect()) {
            const returnUrl = router.url;
            void router.navigate(['/login'], {
              queryParams: returnUrl ? { returnUrl } : undefined
            });
          }
          if (wasAuthenticated && !isLogoutRequest) {
            popupService.showInformation('Session expired', 'Your session has ended. Sign in again to continue.');
          }
        }
      }

      const body = isRecord(error.error) ? error.error : {};
      const apiError: ApiError = {
        status: error.status,
        message: getMessage(body, error.status),
        ...(isRecord(body['errors']) ? { validationErrors: toValidationErrors(body['errors']) } : {})
      };

      return throwError(() => apiError);
    })
  );
};

function getMessage(body: Record<string, unknown>, status: number): string {
  if (status === 0) {
    return 'Unable to connect to the server. Check your connection and try again.';
  }

  const message = body['message'];
  if (typeof message === 'string') {
    return message;
  }

  const title = body['title'];
  if (typeof title === 'string') {
    return title;
  }

  return 'The request could not be completed.';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toValidationErrors(errors: Record<string, unknown>): Record<string, readonly string[]> {
  return Object.fromEntries(
    Object.entries(errors).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
    ])
  );
}
