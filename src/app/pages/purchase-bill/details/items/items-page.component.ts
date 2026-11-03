import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { ApiError } from '../../../../models/api/api-error.model';
import { PurchaseBillLine } from '../../../../models/purchase-bill/purchase-bill-line.model';
import { PurchasedOrderItemRequest } from '../../../../models/purchase-order/purchased-order.model';
import { PopupMessageService } from '../../../../services/popup-message.service';
import { PurchasedOrderService } from '../../../../services/purchased-order.service';
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
  protected readonly isSubmitting = signal(false);
  private readonly purchasedOrderService = inject(PurchasedOrderService);
  private readonly popupService = inject(PopupMessageService);

  protected addLine(line: PurchaseBillLine): void {
    this.lines.update((lines) => [...lines, line]);
  }

  protected submitPurchase(): void {
    const linesToSave = this.lines();
    if (this.isSubmitting() || linesToSave.length === 0) {
      return;
    }

    const items: PurchasedOrderItemRequest[] = linesToSave.map((line) => ({
      item: line.itemName,
      locationId: line.locationId,
      standardCost: line.standardCost,
      standardPrice: line.standardPrice,
      qty: line.quantity,
      freeQty: line.freeQuantity,
      discount: line.discountPercent
    }));

    this.isSubmitting.set(true);
    this.purchasedOrderService.create({ items })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (savedOrder) => {
          const savedLineIds = new Set(linesToSave.map((line) => line.id));
          this.lines.update((currentLines) => currentLines.filter((line) => !savedLineIds.has(line.id)));
          this.popupService.showSuccess(
            'Purchase order saved',
            `Purchase order ${savedOrder.billId} was saved with ${savedOrder.items.length} ${savedOrder.items.length === 1 ? 'item' : 'items'}.`
          );
        },
        error: (error: unknown) => {
          this.popupService.showError(
            'Could not save purchase order',
            isApiError(error) ? error.message : 'The purchase order could not be saved. Please try again.'
          );
        }
      });
  }
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object'
    && error !== null
    && 'status' in error
    && typeof error.status === 'number'
    && 'message' in error
    && typeof error.message === 'string';
}
