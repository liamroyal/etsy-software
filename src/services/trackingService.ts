import { db } from './firebase';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { Order, OrderUpdateResult } from '../types/order';

export const trackingService = {
  /**
   * Update an existing order
   */
  async updateOrder(orderNumber: string, updates: Partial<Order>): Promise<OrderUpdateResult> {
    try {
      const orderRef = doc(db, 'orders', orderNumber);
      await updateDoc(orderRef, {
        ...updates,
        lastUpdated: new Date()
      });

      return {
        success: true,
        message: `Successfully updated order ${orderNumber}`,
        orderNumber
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        message: `Failed to update order: ${errorMessage}`,
        orderNumber,
        error
      };
    }
  },

  async addOrder(order: Order): Promise<OrderUpdateResult> {
    try {
      // Basic validation
      if (!order.orderNumber.startsWith('#')) {
        return {
          success: false,
          message: 'Order number must start with #',
          orderNumber: order.orderNumber
        };
      }

      const ordersRef = collection(db, 'orders');
      const orderDoc = doc(ordersRef, order.orderNumber);
      await setDoc(orderDoc, {
        ...order,
        dateAdded: new Date(),
        lastUpdated: new Date()
      });

      return {
        success: true,
        message: `Successfully added order ${order.orderNumber}`,
        orderNumber: order.orderNumber,
        order
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        message: `Failed to add order: ${errorMessage}`,
        orderNumber: order.orderNumber,
        error
      };
    }
  }
}; 