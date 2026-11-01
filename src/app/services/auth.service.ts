import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { EMPTY, finalize, Observable, tap } from 'rxjs';

import { environment } from '../environments/environment';
import { LoginRequestDto } from '../models/auth/login-request.dto';
import { LoginResponseDto } from '../models/auth/login-response.dto';
import { AuthSessionService } from './auth-session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authSession = inject(AuthSessionService);
  private readonly authUrl = `${environment.apiUrl}/auth`;
  private readonly logoutInProgress = signal(false);

  login(request: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.authUrl}/login`, request).pipe(
      tap((response) => {
        if (response.authenticated) {
          this.authSession.markAuthenticated(response.username);
        }
      })
    );
  }

  logout(): Observable<void> {
    if (this.logoutInProgress()) {
      return EMPTY;
    }

    this.logoutInProgress.set(true);
    return this.http.post<void>(`${this.authUrl}/logout`, null).pipe(
      finalize(() => {
        this.authSession.markUnauthenticated();
        this.authSession.markExplicitlySignedOut();
        this.logoutInProgress.set(false);
      })
    );
  }
}
