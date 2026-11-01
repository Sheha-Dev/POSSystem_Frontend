import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-purchase-section-placeholder',
  templateUrl: './section-placeholder.component.html',
  styleUrl: './section-placeholder.component.scss'
})
export class PurchaseSectionPlaceholder {
  private readonly route = inject(ActivatedRoute);
  protected readonly title = toSignal(
    this.route.data.pipe(map((data) => typeof data['title'] === 'string' ? data['title'] : 'Purchase Bill')),
    { initialValue: 'Purchase Bill' }
  );
}
