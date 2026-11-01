import { AsyncPipe } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AutocompleteDropdownComponent } from '../../../../../components/common/autocomplete-dropdown/autocomplete-dropdown.component';
import { AutocompleteOption } from '../../../../../models/common/autocomplete-option.model';
import { LocationDetailsResponseDto } from '../../../../../models/locations/location-details-response.dto';
import { PurchaseBillLine } from '../../../../../models/purchase-bill/purchase-bill-line.model';
import { ItemCatalogService } from '../../../../../services/item-catalog.service';
import { LocationService } from '../../../../../services/location.service';

@Component({
  selector: 'app-item-entry-form',
  imports: [AsyncPipe, ReactiveFormsModule, AutocompleteDropdownComponent],
  templateUrl: './item-entry-form.component.html',
  styleUrl: './item-entry-form.component.scss'
})
export class ItemEntryForm {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly locationService = inject(LocationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly lineAdded = output<PurchaseBillLine>();
  protected readonly itemNames$ = inject(ItemCatalogService).getItems();
  protected readonly locations = signal<LocationDetailsResponseDto[]>([]);
  protected readonly locationOptions = computed<readonly AutocompleteOption[]>(() =>
    this.locations().map((location) => ({ label: location.locationName, value: location.locationId }))
  );
  protected readonly locationsLoading = signal(true);
  protected readonly locationsError = signal<string | null>(null);

  protected readonly itemForm = this.formBuilder.group({
    itemName: ['', [Validators.required, Validators.maxLength(100)]],
    locationId: ['', Validators.required],
    standardCost: [0, [Validators.required, Validators.min(0)]],
    standardPrice: [0, [Validators.required, Validators.min(0)]],
    margin: [{ value: 0, disabled: true }],
    quantity: [1, [Validators.required, Validators.min(0.0001)]],
    freeQuantity: [0, [Validators.required, Validators.min(0)]],
    discountPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    totalCost: [{ value: 0, disabled: true }],
    totalSelling: [{ value: 0, disabled: true }]
  });

  constructor() {
    this.itemForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recalculate());

    afterNextRender(() => this.loadLocations());
  }

  protected addItem(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const values = this.itemForm.getRawValue();
    const location = this.locations().find((item) => item.locationId === values.locationId);
    if (!location) {
      this.locationsError.set('Choose an available location before adding this item.');
      return;
    }

    const itemName = values.itemName.trim();
    if (!itemName) {
      this.itemForm.controls.itemName.setErrors({ required: true });
      this.itemForm.controls.itemName.markAsTouched();
      return;
    }

    this.lineAdded.emit({
      id: crypto.randomUUID(),
      itemName,
      locationId: location.locationId,
      locationName: location.locationName,
      standardCost: values.standardCost,
      standardPrice: values.standardPrice,
      margin: roundMoney(values.standardPrice - values.standardCost),
      quantity: values.quantity,
      freeQuantity: values.freeQuantity,
      discountPercent: values.discountPercent,
      totalCost: roundMoney(values.standardCost * values.quantity * (1 - values.discountPercent / 100)),
      totalSelling: roundMoney(values.standardPrice * values.quantity)
    });

    this.itemForm.reset({
      itemName: '',
      locationId: '',
      standardCost: 0,
      standardPrice: 0,
      margin: 0,
      quantity: 1,
      freeQuantity: 0,
      discountPercent: 0,
      totalCost: 0,
      totalSelling: 0
    });
    this.locationsError.set(null);
  }

  protected fieldError(field: 'itemName' | 'locationId' | 'quantity' | 'discountPercent'): string | null {
    const control = this.itemForm.controls[field];
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.hasError('required')) {
      return field === 'locationId' ? 'Choose a location.' : 'This field is required.';
    }
    if (control.hasError('maxlength')) {
      return 'Item name must be 100 characters or fewer.';
    }
    if (control.hasError('min')) {
      return field === 'discountPercent' ? 'Discount cannot be negative.' : 'Value must be greater than zero.';
    }
    if (control.hasError('max')) {
      return 'Discount cannot exceed 100%.';
    }

    return null;
  }

  protected numberError(field: 'standardCost' | 'standardPrice' | 'freeQuantity'): string | null {
    const control = this.itemForm.controls[field];
    if (control.touched && control.hasError('required')) {
      return 'Enter a value.';
    }
    return control.touched && control.hasError('min') ? 'Value cannot be negative.' : null;
  }

  private loadLocations(): void {
    this.locationsLoading.set(true);
    this.locationService.getAllLocations()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.locationsLoading.set(false))
      )
      .subscribe({
        next: (locations) => {
          const activeLocations = locations.filter((location) => location.isActive);
          this.locations.set(activeLocations);
          this.locationsError.set(activeLocations.length === 0 ? 'No active saved locations are available.' : null);
        },
        error: (error: unknown) => {
          this.locationsError.set(getApiErrorMessage(error));
        }
      });
  }

  private recalculate(): void {
    const values = this.itemForm.getRawValue();
    this.itemForm.patchValue({
      margin: roundMoney(values.standardPrice - values.standardCost),
      totalCost: roundMoney(values.standardCost * values.quantity * (1 - values.discountPercent / 100)),
      totalSelling: roundMoney(values.standardPrice * values.quantity)
    }, { emitEvent: false });
  }
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getApiErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'Could not load locations. Try again in a moment.';
}
