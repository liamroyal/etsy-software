export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  listingLink?: string;
  fulfillmentLink?: string;
  fulfillmentMethod?: string;
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