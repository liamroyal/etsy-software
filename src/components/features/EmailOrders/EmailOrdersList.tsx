import React from 'react';
import { useEmailOrders } from '../../../hooks/useEmailOrders';
import { OrderRow } from './OrderRow';
import { EmailOrder, filterOrdersByBusinessLogic } from '../../../services/emailOrderService';
import styles from './EmailOrdersList.module.css';

interface EmailOrdersListProps {
  limit?: number;
  onOrderClick?: (order: EmailOrder) => void;
}

export const EmailOrdersList: React.FC<EmailOrdersListProps> = ({ 
  limit, 
  onOrderClick 
}) => {
  const { orders: allOrders, loading, error } = useEmailOrders(limit);
  
  // Filter out fulfilled orders for the recent orders view
  const orders = filterOrdersByBusinessLogic(allOrders);

  const handleStatusUpdate = (orderId: string, newStatus: 'pending' | 'overdue' | 'fulfilled' | 'refunded') => {
    console.log(`Order ${orderId} status updated to: ${newStatus}`);
    // The useEmailOrders hook will automatically update via Firestore real-time listener
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>📧 Recent Email Orders</h3>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>📧 Recent Email Orders</h3>
        </div>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorText}>Failed to load orders</p>
          <p className={styles.errorDetails}>{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>📧 Recent Email Orders</h3>
        </div>
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyText}>No orders found</p>
          <p className={styles.emptySubtext}>
            Orders will appear here when email parsing detects new Etsy transactions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>📧 Recent Email Orders</h3>
        <div className={styles.orderCount}>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </div>
      </div>
      
      {/* Column Headers */}
      <div className={styles.headerRow}>
        <div className={styles.headerCell}>Order Details</div>
        <div className={styles.headerCell}>Store & Customer</div>
        <div className={styles.headerCell}>Amount</div>
        <div className={styles.headerCell}>Status</div>
      </div>

      {/* Scrollable Orders Container */}
      <div className={styles.ordersContainer}>
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            onClick={onOrderClick}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
}; 