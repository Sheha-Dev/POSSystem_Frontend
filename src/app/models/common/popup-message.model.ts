export type PopupMessageType = 'success' | 'error' | 'warning' | 'information' | 'confirmation';

export interface PopupMessage {
  type: PopupMessageType;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}
