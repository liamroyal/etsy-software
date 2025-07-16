import { collection, query, orderBy, limit, onSnapshot, QuerySnapshot, DocumentData, where, QueryConstraint } from 'firebase/firestore';
import { db } from './firebase';

export interface EmailOrder {
  id: string;
  orderNumber: string;
  store: string; // Database field name
  amount: number; // Database field name for original amount
  originalCurrency: string; // Updated field name
  amountAUD: number; // Standardized as number (was string causing parsing issues)
  customerName?: string;
  status: 'pending' | 'overdue' | 'fulfilled' | 'refunded' | 'issue_raised' | 'flagged' | 'resolved'; // Updated status field
  receivedAt: any; // Firestore timestamp
  messageId?: string;
  type?: 'ORDER' | 'REFUND';
  shippingAddress?: string;
  refundReason?: string;
  refundAmount?: number;
  createdAt?: any;
  updatedAt?: any;
  // Fulfillment fields
  fulfilledAt?: string; // Where the order was fulfilled
  fulfillmentCost?: number; // Cost of fulfillment in AUD
  // New refund and flagging fields
  refundPercentage?: number; // Percentage of order amount refunded
  customerReturningItems?: boolean; // Whether customer is returning items
  issueDescription?: string; // Description of issue when flagged
  wasEverFlagged?: boolean; // Track if order was previously flagged (for resolved orders)
  resolvedDescription?: string; // Description of how the issue was resolved
  // Etsy fee tracking fields
  etsyFeePercentage?: number; // Etsy's commission percentage (default 11.5%)
  etsyFeeAmount?: number; // Calculated Etsy fee in AUD
  netRevenue?: number; // Revenue after Etsy fees (amountAUD - etsyFeeAmount)
  // Historical data preservation for refunds
  originalAmountAUD?: number; // Original amount before refund adjustments
  originalEtsyFeeAmount?: number; // Original Etsy fee before refund adjustments
  originalNetRevenue?: number; // Original net revenue before refund adjustments
  originalFulfillmentCost?: number; // Original fulfillment cost before refund adjustments
}

export interface EmailOrdersResult {
  orders: EmailOrder[];
  loading: boolean;
  error: string | null;
}

// Subscribe to email orders with proper filtering logic
export const subscribeToEmailOrders = (
  callback: (result: EmailOrdersResult) => void,
  limitCount?: number, // Made optional since we want to show all orders
  dateRange?: { startDate?: Date; endDate?: Date } // Add date range filtering
) => {
  const ordersRef = collection(db, 'email_orders');
  
  // Build query properly to avoid Firestore issues
  let q;
  
  if (dateRange?.startDate || dateRange?.endDate) {
    // If we have date filters, build query with where clauses first
    const constraints: QueryConstraint[] = [];
    
    if (dateRange.startDate) {
      constraints.push(where('receivedAt', '>=', dateRange.startDate.toISOString()));
    }
    if (dateRange.endDate) {
      constraints.push(where('receivedAt', '<=', dateRange.endDate.toISOString()));
    }
    
    // Add orderBy
    constraints.push(orderBy('receivedAt', 'desc'));
    
    // Add limit if specified
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    
    q = query(ordersRef, ...constraints);
  } else {
    // Simple query without date filtering
    const constraints: QueryConstraint[] = [orderBy('receivedAt', 'desc')];
    
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    
    q = query(ordersRef, ...constraints);
  }

  // Start with loading state
  callback({ orders: [], loading: true, error: null });

  const unsubscribe = onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      try {
        const rawOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as EmailOrder[];

        // Return filtered orders
        const sortedOrders = sortOrdersByPriority(rawOrders);
        callback({ orders: sortedOrders, loading: false, error: null });
      } catch (error) {
        console.error('Error fetching email orders:', error);
        callback({ 
          orders: [], 
          loading: false, 
          error: error instanceof Error ? error.message : 'Failed to fetch orders'
        });
      }
    },
    (error) => {
      console.error('Error subscribing to email orders:', error);
      callback({ 
        orders: [], 
        loading: false, 
        error: error.message || 'Failed to subscribe to orders'
      });
    }
  );

  return unsubscribe;
};

// Optimized hook for recent orders only (performance optimization)
export const subscribeToRecentOrders = (
  callback: (result: EmailOrdersResult) => void,
  daysBack: number = 30
) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);
  
  return subscribeToEmailOrders(callback, 1000, { startDate, endDate });
};

// Hook for fulfilled orders with pagination
export const subscribeToPaginatedOrders = (
  callback: (result: EmailOrdersResult) => void,
  pageSize: number = 50,
  startAfter?: Date
) => {
  const dateRange = startAfter ? { endDate: startAfter } : undefined;
  return subscribeToEmailOrders(callback, pageSize, dateRange);
};

// Filter orders based on business logic
export const filterOrdersByBusinessLogic = (orders: EmailOrder[]): EmailOrder[] => {
  return orders.filter(order => {
    // Only show pending and issue_raised orders in recent orders view
    // All processed orders (fulfilled, refunded, flagged, resolved) should only appear in the fulfilled orders section
    return ['pending', 'overdue', 'issue_raised'].includes(order.status);
  });
};

// Sort orders by priority: oldest first (more urgent orders appear first)
export const sortOrdersByPriority = (orders: EmailOrder[]): EmailOrder[] => {
  return orders.sort((a, b) => {
    // Priority 1: Flagged orders first (highest priority)
    const priorityA = a.status === 'flagged' ? 0 : 1;
    const priorityB = b.status === 'flagged' ? 0 : 1;
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // Priority 2: Within same status group, sort by date (oldest first)
    const dateA = getOrderDate(a.receivedAt);
    const dateB = getOrderDate(b.receivedAt);
    return dateA.getTime() - dateB.getTime();
  });
};

// Helper function to convert various date formats to Date object
export const getOrderDate = (receivedAt: any): Date => {
  if (!receivedAt) return new Date(0); // Very old date for invalid dates
  
  // Handle Firestore timestamp
  if (receivedAt.toDate) {
    return receivedAt.toDate();
  }
  
  // Handle string dates
  if (typeof receivedAt === 'string') {
    return new Date(receivedAt);
  }
  
  // Handle regular Date objects
  if (receivedAt instanceof Date) {
    return receivedAt;
  }
  
  return new Date(0); // Fallback
};

// Format currency for display
export const formatCurrency = (amount: number, currency: string = 'AUD'): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date for display
export const formatOrderDate = (timestamp: any): string => {
  if (!timestamp) return 'Unknown';
  
  // Handle Firestore timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  
  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Get fulfillment status display
export const getStatusDisplay = (status: 'pending' | 'overdue' | 'fulfilled' | 'refunded' | 'issue_raised' | 'flagged' | 'resolved') => {
  switch (status) {
    case 'fulfilled':
      return { emoji: '✅', text: 'FULFILLED', color: '#10B981' };
    case 'pending':
      return { emoji: '⏳', text: 'PENDING', color: '#F59E0B' };
    case 'overdue':
      return { emoji: '⚠️', text: 'OVERDUE', color: '#EF4444' };
    case 'refunded':
      return { emoji: '↩️', text: 'REFUNDED', color: '#6B7280' };
    case 'issue_raised':
      return { emoji: '🔴', text: 'ISSUE RAISED', color: '#DC2626' };
    case 'flagged':
      return { emoji: '🚩', text: 'FLAGGED', color: '#F59E0B' };
    case 'resolved':
      return { emoji: '✅', text: 'RESOLVED', color: '#10B981' };
    default:
      return { emoji: '❓', text: 'UNKNOWN', color: '#6B7280' };
  }
};

// Check if order is older than 3 days
export const isOrderOld = (receivedAt: any, dayThreshold: number = 3): boolean => {
  const orderDate = getOrderDate(receivedAt);
  const now = new Date();
  const diffTime = now.getTime() - orderDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= dayThreshold;
};

// Get order age in days
export const getOrderAgeDays = (receivedAt: any): number => {
  const orderDate = getOrderDate(receivedAt);
  const now = new Date();
  const diffTime = now.getTime() - orderDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Filter orders to get fulfilled orders for current month
export const getFulfilledOrdersForCurrentMonth = (orders: EmailOrder[]): EmailOrder[] => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return orders.filter(order => {
    // Include all orders that represent fulfilled business (fulfilled, refunded, flagged, resolved)
    // These are orders that have been processed/fulfilled at some point
    if (!['fulfilled', 'refunded', 'flagged', 'resolved'].includes(order.status)) {
      return false;
    }

    // Use updatedAt timestamp for when the order was last processed
    // If no updatedAt, include the order (it might be an old fulfilled order)
    if (!order.updatedAt) {
      return true;
    }

    const processedDate = getOrderDate(order.updatedAt);
    return processedDate >= startOfMonth && processedDate <= endOfMonth;
  });
};

// Calculate days since fulfillment
export const getDaysSinceFulfillment = (updatedAt: any): number => {
  const fulfillmentDate = getOrderDate(updatedAt);
  const now = new Date();
  
  // Reset both dates to start of day to avoid time-of-day issues
  const fulfillmentStartOfDay = new Date(fulfillmentDate);
  fulfillmentStartOfDay.setHours(0, 0, 0, 0);
  
  const nowStartOfDay = new Date(now);
  nowStartOfDay.setHours(0, 0, 0, 0);
  
  const diffTime = nowStartOfDay.getTime() - fulfillmentStartOfDay.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Format fulfillment date for display
export const formatFulfillmentDate = (updatedAt: any): string => {
  const fulfillmentDate = getOrderDate(updatedAt);
  return fulfillmentDate.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Format days ago text
export const formatDaysAgoText = (days: number): string => {
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 0) return 'Today'; // Handle negative days (timezone edge cases)
  return `${days} days ago`;
}; 