import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupMessageComponent } from './components/common/popup-message/popup-message.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PopupMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly themeService = inject(ThemeService);
}
