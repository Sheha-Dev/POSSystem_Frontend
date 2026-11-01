export interface PurchaseBillLine {
  id: string;
  itemName: string;
  locationId: string;
  locationName: string;
  standardCost: number;
  standardPrice: number;
  margin: number;
  quantity: number;
  freeQuantity: number;
  discountPercent: number;
  totalCost: number;
  totalSelling: number;
}
