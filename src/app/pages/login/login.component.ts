import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

import { ApiError } from '../../models/api/api-error.model';
import { AuthService } from '../../services/auth.service';
import { PopupMessageService } from '../../services/popup-message.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly authService = inject(AuthService);
  private readonly popupService = inject(PopupMessageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly passwordVisible = signal(false);

  protected readonly loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.maxLength(200)]],
    password: ['', [Validators.required, Validators.maxLength(200)]]
  });

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.authService.login(this.loginForm.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response.authenticated) {
            void this.router.navigateByUrl('/dashboard');
            return;
          }

          this.popupService.showError('Sign-in failed', 'The sign-in request could not be completed. Please try again.');
        },
        error: (error: unknown) => {
          this.popupService.showError(
            'Sign-in failed',
            isApiError(error) ? error.message : 'Unable to sign in right now. Please try again.'
          );
        }
      });
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object'
    && error !== null
    && 'status' in error
    && typeof error.status === 'number'
    && 'message' in error
    && typeof error.message === 'string';
}
