export interface Order {
  orderNumber: string;
  trackingNumber: string;
  trackingLink: string;
  fulfilled: boolean;
  // Adding metadata fields that might be useful
  dateAdded?: Date;
  lastUpdated?: Date;
}

export interface InvalidOrderRow {
  orderNumber?: string;
  trackingNumber?: string;
  errors: string[];
}

// Type for validation results when processing orders
export interface OrderValidationResult {
  valid: Order[];
  invalid: InvalidOrderRow[];
}

// Type for the response when adding/updating orders
export interface OrderUpdateResult {
  success: boolean;
  message: string;
  orderNumber?: string;
  order?: Order;
  error?: any;
} 