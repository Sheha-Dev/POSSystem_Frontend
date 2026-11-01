import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { PurchaseBillLine } from '../../../../../models/purchase-bill/purchase-bill-line.model';

@Component({
  selector: 'app-items-table',
  imports: [DecimalPipe],
  templateUrl: './items-table.component.html',
  styleUrl: './items-table.component.scss'
})
export class ItemsTable {
  readonly lines = input.required<PurchaseBillLine[]>();
}
