import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-purchase-details-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './details-shell.component.html',
  styleUrl: './details-shell.component.scss'
})
export class PurchaseDetailsShell {}
