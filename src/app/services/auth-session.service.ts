import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly signOutKey = 'pos-system-signed-out';
  private readonly platformId = inject(PLATFORM_ID);

  readonly isAuthenticated = signal(false);
  readonly username = signal<string | null>(null);
  readonly explicitlySignedOut = signal(false);
  readonly redirectingToLogin = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.explicitlySignedOut.set(sessionStorage.getItem(this.signOutKey) === 'true');
      } catch {
        // Keep the in-memory sign-out state if session storage is unavailable.
      }
    }
  }

  markAuthenticated(username?: string): void {
    this.explicitlySignedOut.set(false);
    this.redirectingToLogin.set(false);
    if (isPlatformBrowser(this.platformId)) {
      try {
        sessionStorage.removeItem(this.signOutKey);
      } catch {
        // Authentication still succeeds when browser storage is unavailable.
      }
    }
    if (username) {
      this.username.set(username);
    }
    this.isAuthenticated.set(true);
  }

  markUnauthenticated(): boolean {
    const wasAuthenticated = this.isAuthenticated();
    this.isAuthenticated.set(false);
    this.username.set(null);
    return wasAuthenticated;
  }

  beginLoginRedirect(): boolean {
    if (this.redirectingToLogin()) {
      return false;
    }
    this.redirectingToLogin.set(true);
    return true;
  }

  markExplicitlySignedOut(): void {
    this.explicitlySignedOut.set(true);
    if (isPlatformBrowser(this.platformId)) {
      try {
        sessionStorage.setItem(this.signOutKey, 'true');
      } catch {
        // Keep the in-memory sign-out state if browser storage is unavailable.
      }
    }
  }
}
