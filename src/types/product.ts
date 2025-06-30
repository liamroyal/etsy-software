export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string; // 'USD', 'AUD', 'NZD'
  imageUrl: string;
  listingLink?: string;
  fulfillmentLink?: string;
  fulfillmentMethod?: string;
  store: string;
  photoUrl: string;
  photoPublicId: string; // Cloudinary public ID
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search: string;
  minPrice?: number;
  maxPrice?: number;
  fulfillmentMethod?: string;
} 