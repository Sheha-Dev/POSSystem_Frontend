import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { PurchaseBillLine } from '../../../../../models/purchase-bill/purchase-bill-line.model';

@Component({
  selector: 'app-purchase-summary',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './purchase-summary.component.html',
  styleUrl: './purchase-summary.component.scss'
})
export class PurchaseSummary {
  readonly lines = input.required<PurchaseBillLine[]>();

  protected readonly summary = computed(() => {
    const lines = this.lines();
    return {
      itemCount: lines.length,
      quantity: lines.reduce((total, line) => total + line.quantity, 0),
      costBeforeDiscount: lines.reduce((total, line) => total + line.standardCost * line.quantity, 0),
      totalCost: lines.reduce((total, line) => total + line.totalCost, 0),
      totalDiscount: lines.reduce((total, line) => total + line.standardCost * line.quantity - line.totalCost, 0),
      totalSelling: lines.reduce((total, line) => total + line.totalSelling, 0)
    };
  });
}
