import { Injectable, signal } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';

import { PopupMessage, PopupMessageType } from '../models/common/popup-message.model';

@Injectable({ providedIn: 'root' })
export class PopupMessageService {
  readonly currentMessage = signal<PopupMessage | null>(null);
  private confirmationResult: Subject<boolean> | null = null;

  show(type: Exclude<PopupMessageType, 'confirmation'>, title: string, message: string): void {
    this.finishConfirmation(false);
    this.currentMessage.set({ type, title, message });
  }

  showSuccess(title: string, message: string): void {
    this.show('success', title, message);
  }

  showError(title: string, message: string): void {
    this.show('error', title, message);
  }

  showWarning(title: string, message: string): void {
    this.show('warning', title, message);
  }

  showInformation(title: string, message: string): void {
    this.show('information', title, message);
  }

  confirm(title: string, message: string, confirmLabel = 'Confirm', cancelLabel = 'Cancel'): Observable<boolean> {
    this.finishConfirmation(false);
    this.confirmationResult = new Subject<boolean>();
    this.currentMessage.set({ type: 'confirmation', title, message, confirmLabel, cancelLabel });
    return this.confirmationResult.asObservable().pipe(take(1));
  }

  resolveConfirmation(confirmed: boolean): void {
    this.finishConfirmation(confirmed);
    this.currentMessage.set(null);
  }

  dismiss(): void {
    this.finishConfirmation(false);
    this.currentMessage.set(null);
  }

  private finishConfirmation(result: boolean): void {
    if (!this.confirmationResult) {
      return;
    }

    this.confirmationResult.next(result);
    this.confirmationResult.complete();
    this.confirmationResult = null;
  }
}
