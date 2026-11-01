import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, expand, Observable, reduce } from 'rxjs';

import { environment } from '../environments/environment';
import { LocationDetailsRequestDto } from '../models/locations/location-details-request.dto';
import { LocationDetailsResponseDto } from '../models/locations/location-details-response.dto';
import { PagedResponseDto } from '../models/api/paged-response.dto';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly locationsUrl = `${environment.apiUrl}/locations`;

  getLocations(pageNumber = 1, pageSize = 50): Observable<PagedResponseDto<LocationDetailsResponseDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PagedResponseDto<LocationDetailsResponseDto>>(this.locationsUrl, { params });
  }

  getAllLocations(pageSize = 100): Observable<LocationDetailsResponseDto[]> {
    return this.getLocations(1, pageSize).pipe(
      expand((page) => page.pageNumber * page.pageSize < page.totalCount
        ? this.getLocations(page.pageNumber + 1, pageSize)
        : EMPTY),
      reduce((locations, page) => [...locations, ...page.items], [] as LocationDetailsResponseDto[])
    );
  }

  saveLocations(locations: readonly LocationDetailsRequestDto[]): Observable<LocationDetailsResponseDto[]> {
    return this.http.post<LocationDetailsResponseDto[]>(this.locationsUrl, locations);
  }
}
