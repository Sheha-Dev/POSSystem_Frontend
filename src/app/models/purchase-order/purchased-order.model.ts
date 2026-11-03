export interface PurchasedOrderItem {
  billItemId: string;
  item: string;
  locationId: string;
  standardCost: number;
  standardPrice: number;
  qty: number;
  freeQty: number;
  discount: number;
}

export interface PurchasedOrderItemRequest {
  item: string;
  locationId: string;
  standardCost: number;
  standardPrice: number;
  qty: number;
  freeQty: number;
  discount: number;
}

export interface PurchasedOrderRequest {
  items: PurchasedOrderItemRequest[];
}

export interface PurchasedOrder {
  billId: string;
  createdBy: string;
  createdDate: string;
  isActive: boolean;
  items: PurchasedOrderItem[];
}
