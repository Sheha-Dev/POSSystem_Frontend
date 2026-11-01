export interface LocationDetailsRequestDto {
  locationCode: string;
  locationName: string;
  createdBy: string;
  createdDate?: string | null;
  isActive?: boolean;
}
