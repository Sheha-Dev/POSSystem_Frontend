import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { AutocompleteOption } from '../models/common/autocomplete-option.model';

@Injectable({ providedIn: 'root' })
export class ItemCatalogService {
  private readonly itemNames: readonly AutocompleteOption[] = [
    'Mango',
    'Apple',
    'Banana',
    'Orange',
    'Grapes',
    'Kiwi',
    'Strawberry'
  ].map((name) => ({ label: name, value: name }));

  getItems(): Observable<readonly AutocompleteOption[]> {
    return of(this.itemNames).pipe(delay(200));
  }
}
