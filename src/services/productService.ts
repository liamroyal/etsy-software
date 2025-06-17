import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  startAt,
  endAt,
  CollectionReference,
  DocumentData,
  Query
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, ProductFilters } from '../types/product';

const PRODUCTS_COLLECTION = 'products';

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      let productsQuery: Query<DocumentData> = collection(db, PRODUCTS_COLLECTION);
      
      // Build query based on filters
      if (filters) {
        // Always order by creation date
        productsQuery = query(productsQuery, orderBy('createdAt', 'desc'));

        if (filters.fulfillmentMethod) {
          productsQuery = query(productsQuery, where('fulfillmentMethod', '==', filters.fulfillmentMethod));
        }
        if (filters.minPrice) {
          productsQuery = query(productsQuery, where('price', '>=', filters.minPrice));
        }
        if (filters.maxPrice) {
          productsQuery = query(productsQuery, where('price', '<=', filters.maxPrice));
        }
      } else {
        productsQuery = query(productsQuery, orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(productsQuery);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // If searching, filter products in memory for more flexible matching
      if (filters?.search && filters.search.trim()) {
        return products.filter(product => {
          const searchableText = [
            product.name,
            product.fulfillmentMethod
          ].join(' ').toLowerCase();
          return searchableText.includes(filters.search.toLowerCase());
        });
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const now = new Date().toISOString();
      const productWithTimestamps = {
        ...product,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productWithTimestamps);
      
      return {
        id: docRef.id,
        ...productWithTimestamps
      };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}; 