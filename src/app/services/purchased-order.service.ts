import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

import { PagedResponseDto } from '../models/api/paged-response.dto';
import { PurchasedOrder, PurchasedOrderRequest } from '../models/purchase-order/purchased-order.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class PurchasedOrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/purchase-orders`;
  private readonly pageSize = 100;

  getAll(): Observable<PurchasedOrder[]> {
    return this.getPage(1).pipe(
      switchMap((firstPage) => {
        const pageCount = Math.ceil(firstPage.totalCount / this.pageSize);
        if (pageCount <= 1) {
          return [firstPage.items];
        }

        const remainingPages = Array.from({ length: pageCount - 1 }, (_, index) =>
          this.getPage(index + 2).pipe(map((page) => page.items))
        );
        return forkJoin(remainingPages).pipe(
          map((pages) => [...firstPage.items, ...pages.flat()])
        );
      })
    );
  }

  create(request: PurchasedOrderRequest): Observable<PurchasedOrder> {
    return this.http.post<PurchasedOrder>(this.apiUrl, request);
  }

  private getPage(pageNumber: number): Observable<PagedResponseDto<PurchasedOrder>> {
    return this.http.get<PagedResponseDto<PurchasedOrder>>(this.apiUrl, {
      params: { pageNumber, pageSize: this.pageSize }
    });
  }
}
