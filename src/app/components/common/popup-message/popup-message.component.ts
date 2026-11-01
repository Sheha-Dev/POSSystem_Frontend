import { Component, inject } from '@angular/core';

import { PopupMessageService } from '../../../services/popup-message.service';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrl: './popup-message.component.scss'
})
export class PopupMessageComponent {
  protected readonly popupService = inject(PopupMessageService);
}
