import { Component, computed, forwardRef, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AutocompleteOption } from '../../../models/common/autocomplete-option.model';

@Component({
  selector: 'app-autocomplete-dropdown',
  templateUrl: './autocomplete-dropdown.component.html',
  styleUrl: './autocomplete-dropdown.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutocompleteDropdownComponent),
    multi: true
  }]
})
export class AutocompleteDropdownComponent implements ControlValueAccessor {
  private readonly optionsState = signal<readonly AutocompleteOption[]>([]);
  private readonly searchText = signal('');
  private readonly selectedValue = signal<string | null>(null);
  private readonly activeIndex = signal(0);

  @Input() placeholder = 'Search options';
  @Input() inputId = 'autocomplete-input';
  @Input() ariaLabel = 'Search options';
  @Input() required = false;
  @Input() allowClear = true;
  @Input() loading = false;
  @Input() errorMessage: string | null = null;

  @Input()
  set options(value: readonly AutocompleteOption[] | null) {
    const options = value ?? [];
    this.optionsState.set(options);
    const selected = options.find((option) => option.value === this.selectedValue());
    if (selected) {
      this.searchText.set(selected.label);
    }
  }

  protected readonly isOpen = signal(false);
  protected readonly isDisabled = signal(false);
  protected readonly filteredOptions = computed(() => {
    const query = this.searchText().trim().toLocaleLowerCase();
    return this.optionsState().filter((option) => option.label.toLocaleLowerCase().includes(query));
  });

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.selectedValue.set(value);
    const selected = this.optionsState().find((option) => option.value === value);
    this.searchText.set(selected?.label ?? '');
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.selectedValue.set(null);
    this.onChange(null);
    this.activeIndex.set(0);
    this.isOpen.set(true);
  }

  protected openOptions(): void {
    if (!this.isDisabled()) {
      this.isOpen.set(true);
    }
  }

  protected closeOptions(): void {
    this.isOpen.set(false);
    this.onTouched();
  }

  protected selectOption(option: AutocompleteOption): void {
    this.selectedValue.set(option.value);
    this.searchText.set(option.label);
    this.onChange(option.value);
    this.onTouched();
    this.isOpen.set(false);
  }

  protected clearSelection(): void {
    this.selectedValue.set(null);
    this.searchText.set('');
    this.onChange(null);
    this.activeIndex.set(0);
    this.isOpen.set(true);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    const options = this.filteredOptions();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.isOpen.set(true);
      this.activeIndex.update((index) => Math.min(index + 1, Math.max(options.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && this.isOpen() && options.length > 0) {
      event.preventDefault();
      this.selectOption(options[this.activeIndex()] ?? options[0]);
    } else if (event.key === 'Escape') {
      this.isOpen.set(false);
    }
  }
}
