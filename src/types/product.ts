export interface Product {
  id: string;
  name: string;
  price: number;
  photoUrl: string;
  photoPublicId: string; // Cloudinary public ID
  fulfillmentLink: string;
  listingLink: string;
  fulfillmentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search: string;
  minPrice?: number;
  maxPrice?: number;
  fulfillmentMethod?: string;
} 