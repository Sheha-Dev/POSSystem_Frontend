import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'pos-system-theme';
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentTheme = signal<ThemeMode>('light');

  constructor() {
    this.initializeTheme();
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme() === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.documentElement.setAttribute('data-bs-theme', theme);
    try {
      this.document.defaultView?.localStorage.setItem(this.storageKey, theme);
    } catch {
      // Keep the selected theme for this session if browser storage is unavailable.
    }
  }

  private initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const browserWindow = this.document.defaultView;
    let savedTheme: string | null = null;
    try {
      savedTheme = browserWindow?.localStorage.getItem(this.storageKey) ?? null;
    } catch {
      // Fall back to the browser colour preference if storage is unavailable.
    }

    const initialTheme: ThemeMode = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : browserWindow?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    this.setTheme(initialTheme);
  }
}
