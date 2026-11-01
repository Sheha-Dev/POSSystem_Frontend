import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-purchase-bill-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './purchase-bill-shell.component.html',
  styleUrl: './purchase-bill-shell.component.scss'
})
export class PurchaseBillShell {}
