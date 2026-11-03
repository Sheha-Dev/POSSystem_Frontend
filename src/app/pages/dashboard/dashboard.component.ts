import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PurchasedOrder } from '../../models/purchase-order/purchased-order.model';
import { PurchasedOrderService } from '../../services/purchased-order.service';

interface ItemQuantity {
  name: string;
  quantity: number;
  color: string;
  percent: number;
}

const CHART_COLORS = ['#3975c6', '#36a58a', '#e4a544', '#8364bd', '#d86c73', '#37a7b8', '#75934b', '#ce7d3a'];

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly orderService = inject(PurchasedOrderService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly orders = signal<PurchasedOrder[]>([]);

  protected readonly latestOrders = computed(() => this.orders().slice(0, 5).map((order) => ({
    ...order,
    totalQty: order.items.reduce((sum, item) => sum + item.qty + item.freeQty, 0),
    totalItems: order.items.length,
    netTotal: order.items.reduce((sum, item) =>
      sum + item.standardCost * item.qty * (1 - item.discount / 100), 0)
  })));

  protected readonly latestItems = computed(() => this.orders()
    .flatMap((order) => order.items.map((item) => ({
      ...item,
      billId: order.billId,
      createdDate: order.createdDate
    })))
    .sort((left, right) => Date.parse(right.createdDate) - Date.parse(left.createdDate))
    .slice(0, 10));

  protected readonly itemQuantities = computed<ItemQuantity[]>(() => {
    const totals = new Map<string, number>();
    for (const order of this.orders()) {
      for (const item of order.items) {
        const name = item.item.trim();
        totals.set(name, (totals.get(name) ?? 0) + item.qty + item.freeQty);
      }
    }

    const entries = [...totals.entries()].sort((left, right) => right[1] - left[1]);
    const grandTotal = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
    return entries.map(([name, quantity], index) => ({
      name,
      quantity,
      color: CHART_COLORS[index % CHART_COLORS.length],
      percent: grandTotal === 0 ? 0 : quantity / grandTotal * 100
    }));
  });

  protected readonly chartBackground = computed(() => {
    let currentPercent = 0;
    const segments = this.itemQuantities().map((item) => {
      const start = currentPercent;
      currentPercent += item.percent;
      return `${item.color} ${start}% ${currentPercent}%`;
    });
    return segments.length ? `conic-gradient(${segments.join(', ')})` : 'var(--app-border)';
  });

  protected readonly chartTotal = computed(() =>
    this.itemQuantities().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor() {
    this.orderService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Purchase order data could not be loaded. Please try again later.');
          this.isLoading.set(false);
        }
      });
  }
}
