import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthSessionService } from '../services/auth-session.service';
import { LocationService } from '../services/location.service';

export const authGuard: CanActivateChildFn = (_route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const authSession = inject(AuthSessionService);

  // The browser owns the HttpOnly session cookie; SSR cannot inspect or forward it here.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }
  if (authSession.explicitlySignedOut()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
  if (authSession.isAuthenticated()) {
    return true;
  }

  return inject(LocationService).getLocations(1, 1).pipe(
    map(() => {
      authSession.markAuthenticated();
      return true;
    }),
    catchError((error: unknown) => {
      if (isUnauthorized(error)) {
        authSession.markUnauthenticated();
        return of(router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }));
      }

      // Let the page render so it can show the API or connectivity error itself.
      return of(true);
    })
  );
};

function isUnauthorized(error: unknown): boolean {
  return typeof error === 'object'
    && error !== null
    && 'status' in error
    && error.status === 401;
}
