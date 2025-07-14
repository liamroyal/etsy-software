import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type OrderStatus = 'pending' | 'overdue' | 'fulfilled' | 'refunded' | 'issue_raised' | 'flagged' | 'resolved';

export interface FulfillmentData {
  confirmedFulfilled: boolean;
  fulfilledAt: string;
  fulfillmentCost: number;
}

export interface RefundData {
  refundReason: string;
  refundPercentage: number;
  customerReturningItems: boolean;
}

export interface FlaggedData {
  issueDescription: string;
}

export interface ResolvedData {
  confirmed: boolean;
  resolvedDescription: string;
}

/**
 * Update an order's status in Firestore
 */
export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus): Promise<void> => {
  try {
    const orderRef = doc(db, 'email_orders', orderId);
    
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Order ${orderId} status updated to: ${newStatus}`);
  } catch (error) {
    console.error('❌ Failed to update order status:', error);
    throw new Error(`Failed to update order status: ${error}`);
  }
};

/**
 * Update an order's status with fulfillment data
 */
export const updateOrderWithFulfillment = async (
  orderId: string, 
  fulfillmentData: FulfillmentData
): Promise<void> => {
  try {
    const orderRef = doc(db, 'email_orders', orderId);
    
    await updateDoc(orderRef, {
      status: 'fulfilled',
      fulfilledAt: fulfillmentData.fulfilledAt,
      fulfillmentCost: fulfillmentData.fulfillmentCost,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Order ${orderId} fulfilled with cost: ${fulfillmentData.fulfillmentCost} AUD`);
  } catch (error) {
    console.error('❌ Failed to update order with fulfillment:', error);
    throw new Error(`Failed to update order with fulfillment: ${error}`);
  }
};

/**
 * Update an order with refund data - Enhanced with Etsy fee handling
 */
export const updateOrderWithRefund = async (
  orderId: string,
  currentAmountAUD: string,
  currentFulfillmentCost: number,
  refundData: RefundData
): Promise<void> => {
  try {
    const orderRef = doc(db, 'email_orders', orderId);
    
    // Parse current amounts
    const originalAmount = parseFloat(currentAmountAUD);
    const refundAmount = (originalAmount * refundData.refundPercentage) / 100;
    
    // Calculate original Etsy fees (11.5% of original amount)
    const originalEtsyFeePercentage = 11.5;
    const originalEtsyFeeAmount = (originalAmount * originalEtsyFeePercentage) / 100;
    const originalNetRevenue = originalAmount - originalEtsyFeeAmount;
    
    // Calculate refund adjustments
    let adjustedRevenue: number;
    let adjustedEtsyFee: number;
    let adjustedNetRevenue: number;
    let adjustedCost: number;
    
    if (refundData.customerReturningItems) {
      // Customer returns items: Both revenue and cost set to 0
      // Etsy typically refunds their fees when items are returned
      adjustedRevenue = 0;
      adjustedEtsyFee = 0;
      adjustedNetRevenue = 0;
      adjustedCost = 0;
    } else {
      // Customer keeps items: Revenue reduced, cost unchanged
      // Etsy may or may not refund their portion (assume they do proportionally)
      adjustedRevenue = originalAmount - refundAmount;
      adjustedEtsyFee = originalEtsyFeeAmount - ((originalEtsyFeeAmount * refundData.refundPercentage) / 100);
      adjustedNetRevenue = adjustedRevenue - adjustedEtsyFee;
      adjustedCost = currentFulfillmentCost; // Cost remains the same
    }
    
    // Preserve original values for historical tracking
    const updateData: any = {
      status: 'refunded',
      // Current effective values (for calculations)
      amountAUD: adjustedRevenue,
      etsyFeeAmount: adjustedEtsyFee,
      netRevenue: adjustedNetRevenue,
      fulfillmentCost: adjustedCost,
      // Refund metadata
      refundReason: refundData.refundReason,
      refundPercentage: refundData.refundPercentage,
      customerReturningItems: refundData.customerReturningItems,
      refundAmount: refundAmount,
      // Historical preservation (store original values)
      originalAmountAUD: originalAmount,
      originalEtsyFeeAmount: originalEtsyFeeAmount,
      originalNetRevenue: originalNetRevenue,
      originalFulfillmentCost: currentFulfillmentCost,
      // Timestamp
      refundedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(orderRef, updateData);
    
    console.log(`✅ Order ${orderId} refunded: ${refundData.refundPercentage}% refund`);
  } catch (error) {
    console.error('❌ Failed to update order with refund:', error);
    throw new Error(`Failed to update order with refund: ${error}`);
  }
};

/**
 * Flag an order with issue description
 */
export const updateOrderWithFlag = async (
  orderId: string,
  flaggedData: FlaggedData
): Promise<void> => {
  try {
    const orderRef = doc(db, 'email_orders', orderId);
    
    await updateDoc(orderRef, {
      status: 'flagged',
      issueDescription: flaggedData.issueDescription,
      wasEverFlagged: true,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Order ${orderId} flagged with issue`);
  } catch (error) {
    console.error('❌ Failed to flag order:', error);
    throw new Error(`Failed to flag order: ${error}`);
  }
};

/**
 * Resolve a flagged order back to fulfilled status
 */
export const resolveOrderFlag = async (orderId: string, resolvedData: ResolvedData): Promise<void> => {
  try {
    const orderRef = doc(db, 'email_orders', orderId);
    
    await updateDoc(orderRef, {
      status: 'resolved',
      resolvedDescription: resolvedData.resolvedDescription,
      updatedAt: serverTimestamp()
      // Keep wasEverFlagged: true and issueDescription for historical reference
    });
    
    console.log(`✅ Order ${orderId} flag resolved with description: ${resolvedData.resolvedDescription}`);
  } catch (error) {
    console.error('❌ Failed to resolve order flag:', error);
    throw new Error(`Failed to resolve order flag: ${error}`);
  }
};

/**
 * Bulk update multiple orders' statuses
 */
export const updateMultipleOrderStatuses = async (
  orderIds: string[], 
  newStatus: OrderStatus
): Promise<void> => {
  try {
    const updatePromises = orderIds.map(orderId => 
      updateOrderStatus(orderId, newStatus)
    );
    
    await Promise.all(updatePromises);
    console.log(`✅ Successfully updated ${orderIds.length} orders to status: ${newStatus}`);
  } catch (error) {
    console.error('❌ Failed to bulk update order statuses:', error);
    throw new Error(`Failed to bulk update order statuses: ${error}`);
  }
};

/**
 * Get status display information
 */
export const getStatusInfo = (status: OrderStatus) => {
  const statusMap = {
    pending: { icon: '⏳', label: 'Pending', color: '#F59E0B' },
    overdue: { icon: '⚠️', label: 'Overdue', color: '#EF4444' },
    fulfilled: { icon: '✅', label: 'Fulfilled', color: '#10B981' },
    refunded: { icon: '↩️', label: 'Refunded', color: '#6B7280' },
    issue_raised: { icon: '🔴', label: 'Issue Raised', color: '#DC2626' },
    flagged: { icon: '🚩', label: 'Flagged', color: '#F59E0B' },
    resolved: { icon: '✅', label: 'Resolved', color: '#10B981' }
  };
  
  return statusMap[status] || { icon: '❓', label: 'Unknown', color: '#6B7280' };
}; 