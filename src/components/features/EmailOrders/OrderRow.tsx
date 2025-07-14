import React from 'react';
import { EmailOrder, formatOrderDate, formatCurrency, isOrderOld, getOrderAgeDays } from '../../../services/emailOrderService';
import { StatusUpdateButton } from './StatusUpdateButton';
import styles from './OrderRow.module.css';

interface OrderRowProps {
  order: EmailOrder;
  onClick?: (order: EmailOrder) => void;
  onStatusUpdate?: (orderId: string, newStatus: 'pending' | 'overdue' | 'fulfilled' | 'refunded') => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, onClick, onStatusUpdate }) => {
  const isRefund = order.type === 'REFUND' || order.status === 'refunded';
  const orderIsOld = order.status === 'pending' && isOrderOld(order.receivedAt, 3);
  const orderAge = getOrderAgeDays(order.receivedAt);

  const handleClick = () => {
    if (onClick) {
      onClick(order);
    }
  };

  // amountAUD is already a number, ensure it has a fallback value
  const amountAUD = order.amountAUD || 0;

  // Determine the appropriate CSS class based on order state
  const getOrderRowClass = () => {
    let classes = [styles.orderRow];
    
    switch (order.status) {
      case 'refunded':
        classes.push(styles.orderRowRefund);
        break;
      case 'fulfilled':
        classes.push(styles.orderRowFulfilled);
        break;
      case 'overdue':
        classes.push(styles.orderRowOverdue);
        break;
      case 'pending':
        if (orderIsOld) {
          classes.push(styles.orderRowOld);
        } else {
          classes.push(styles.orderRowPending);
        }
        break;
      default:
        classes.push(styles.orderRowPending);
    }
    
    return classes.join(' ');
  };

  // Get the appropriate status text and styling
  const getStatusDisplay = () => {
    switch (order.status) {
      case 'refunded':
        return {
          text: 'REFUNDED',
          className: styles.statusRefund,
          icon: '↩️'
        };
      case 'fulfilled':
        return {
          text: 'FULFILLED',
          className: styles.statusFulfilled,
          icon: '✅'
        };
      case 'overdue':
        return {
          text: `OVERDUE (${orderAge}d)`,
          className: styles.statusOverdue,
          icon: '⚠️'
        };
      case 'pending':
        if (orderIsOld) {
          return {
            text: `PENDING (${orderAge}d)`,
            className: styles.statusOld,
            icon: '🚨'
          };
        } else {
          return {
            text: 'PENDING',
            className: styles.statusPending,
            icon: '⏳'
          };
        }
      default:
        return {
          text: 'UNKNOWN',
          className: styles.statusPending,
          icon: '❓'
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div 
      className={getOrderRowClass()}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-pending={order.status === 'pending' && order.type !== 'REFUND'}
    >
      {/* Order Details Column */}
      <div className={styles.orderDetails}>
        <div className={styles.orderNumber}>
          {isRefund ? '↩️' : '📦'} #{order.orderNumber}
        </div>
        <div className={styles.orderDate}>{formatOrderDate(order.receivedAt)}</div>
        {isRefund && order.refundReason && (
          <div className={styles.refundReason}>
            Reason: {order.refundReason}
          </div>
        )}
      </div>

      {/* Store & Customer Column */}
      <div className={styles.storeCustomer}>
        <div className={styles.storeName}>{order.store}</div>
        {order.customerName && (
          <div className={styles.customerName}>{order.customerName}</div>
        )}
      </div>

      {/* Amount Column */}
      <div className={styles.amount}>
        {isRefund && order.refundAmount ? (
          <>
            <div className={styles.refundAmount}>
              -{formatCurrency(order.refundAmount, order.originalCurrency)}
            </div>
            <div className={styles.originalAmount}>
              Original: {formatCurrency(order.amount, order.originalCurrency)}
            </div>
          </>
        ) : (
          <>
            <div className={styles.primaryAmount}>
              {formatCurrency(amountAUD)}
            </div>
            <div className={styles.secondaryAmount}>
              Original: {formatCurrency(order.amount, order.originalCurrency)}
            </div>
          </>
        )}
      </div>

      {/* Status Column */}
      <div className={styles.status}>
        <div className={`${styles.statusBadge} ${status.className}`}>
          <span className={styles.statusIcon}>{status.icon}</span>
          <span className={styles.statusText}>{status.text}</span>
        </div>
        {!isRefund && (
          <div className={styles.orderType}>
            {orderIsOld ? `${orderAge} DAYS OLD` : 'ORDER'}
          </div>
        )}
        {onStatusUpdate && (
          <StatusUpdateButton
            order={order}
            onStatusUpdate={onStatusUpdate}
          />
        )}
      </div>
    </div>
  );
}; 