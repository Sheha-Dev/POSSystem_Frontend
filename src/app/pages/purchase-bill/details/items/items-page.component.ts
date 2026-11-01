import { Component, signal } from '@angular/core';

import { PurchaseBillLine } from '../../../../models/purchase-bill/purchase-bill-line.model';
import { ItemEntryForm } from './item-entry-form/item-entry-form.component';
import { ItemsTable } from './items-table/items-table.component';
import { PurchaseSummary } from './purchase-summary/purchase-summary.component';

@Component({
  selector: 'app-purchase-items-page',
  imports: [ItemEntryForm, ItemsTable, PurchaseSummary],
  templateUrl: './items-page.component.html',
  styleUrl: './items-page.component.scss'
})
export class PurchaseItemsPage {
  protected readonly lines = signal<PurchaseBillLine[]>([]);

  protected addLine(line: PurchaseBillLine): void {
    this.lines.update((lines) => [...lines, line]);
  }
}
