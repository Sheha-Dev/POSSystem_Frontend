import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { AuthSessionService } from '../../../services/auth-session.service';
import { PopupMessageService } from '../../../services/popup-message.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected readonly authSession = inject(AuthSessionService);
  protected readonly themeService = inject(ThemeService);
  protected readonly isMenuOpen = signal(false);
  protected readonly isProfileOpen = signal(false);
  protected readonly isLoggingOut = signal(false);

  private readonly authService = inject(AuthService);
  private readonly popupService = inject(PopupMessageService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected logout(): void {
    if (this.isLoggingOut()) {
      return;
    }

    this.isLoggingOut.set(true);
    this.authService.logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.finishLogout(),
        error: () => {
          this.popupService.showWarning(
            'Signed out on this device',
            'The server could not confirm sign-out. The local session has been cleared; sign in again if needed.'
          );
          this.finishLogout();
        }
      });
  }

  private finishLogout(): void {
    this.isLoggingOut.set(false);
    this.isProfileOpen.set(false);
    void this.router.navigateByUrl('/login');
  }
}
