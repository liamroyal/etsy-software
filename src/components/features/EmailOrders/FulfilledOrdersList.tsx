import React, { useState, useEffect } from 'react';
import { 
  subscribeToEmailOrders, 
  getFulfilledOrdersForCurrentMonth,
  getDaysSinceFulfillment,
  formatFulfillmentDate,
  formatDaysAgoText,
  sortOrdersByPriority,
  EmailOrder,
  EmailOrdersResult 
} from '../../../services/emailOrderService';
import { 
  updateOrderWithRefund, 
  updateOrderWithFlag, 
  resolveOrderFlag,
  RefundData,
  FlaggedData,
  ResolvedData 
} from '../../../services/orderUpdateService';
import { 
  calculateMonthlyFinancialStats,
  formatFinancialAmount 
} from '../../../services/financialCalculationService';
import { RefundModal } from './RefundModal';
import { FlaggedModal } from './FlaggedModal';
import { ResolveModal } from './ResolveModal';
import { OrderTooltip } from './OrderTooltip';
import styles from './FulfilledOrdersList.module.css';

interface FulfilledOrdersListProps {
  className?: string;
}

export const FulfilledOrdersList: React.FC<FulfilledOrdersListProps> = ({ 
  className = '' 
}) => {
  const [allOrders, setAllOrders] = useState<EmailOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderIds, setUpdatingOrderIds] = useState<Set<string>>(new Set());
  
  // Modal states
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [flaggedModalOpen, setFlaggedModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<EmailOrder | null>(null);

  // Get current month name for display
  const getCurrentMonthName = (): string => {
    const now = new Date();
    return now.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    const unsubscribe = subscribeToEmailOrders((result: EmailOrdersResult) => {
      setAllOrders(result.orders);
      setLoading(result.loading);
      setError(result.error);
    });

    return () => unsubscribe();
  }, []);

  // Filter to get fulfilled orders for current month and sort by priority
  const fulfilledOrders = sortOrdersByPriority(getFulfilledOrdersForCurrentMonth(allOrders));

  // Calculate monthly stats using new financial calculation service
  const monthlyStats = calculateMonthlyFinancialStats(fulfilledOrders);

  // Handle opening modals
  const handleRefundClick = (order: EmailOrder) => {
    setSelectedOrder(order);
    setRefundModalOpen(true);
  };

  const handleFlaggedClick = (order: EmailOrder) => {
    setSelectedOrder(order);
    setFlaggedModalOpen(true);
  };

  const handleResolveClick = (order: EmailOrder) => {
    setSelectedOrder(order);
    setResolveModalOpen(true);
  };

  // Handle refund confirmation
  const handleRefundConfirm = async (refundData: RefundData) => {
    if (!selectedOrder) return;

    setUpdatingOrderIds(prev => new Set([...prev, selectedOrder.id]));
    
    try {
      await updateOrderWithRefund(
        selectedOrder.id, 
        String(selectedOrder.amountAUD), 
        selectedOrder.fulfillmentCost || 0, 
        refundData
      );
      console.log(`✅ Order ${selectedOrder.id} refunded`);
      setRefundModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error(`❌ Failed to refund order ${selectedOrder.id}:`, error);
    } finally {
      setUpdatingOrderIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedOrder.id);
        return newSet;
      });
    }
  };

  // Handle flagged confirmation
  const handleFlaggedConfirm = async (flaggedData: FlaggedData) => {
    if (!selectedOrder) return;

    setUpdatingOrderIds(prev => new Set([...prev, selectedOrder.id]));
    
    try {
      await updateOrderWithFlag(selectedOrder.id, flaggedData);
      console.log(`✅ Order ${selectedOrder.id} flagged`);
      setFlaggedModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error(`❌ Failed to flag order ${selectedOrder.id}:`, error);
    } finally {
      setUpdatingOrderIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedOrder.id);
        return newSet;
      });
    }
  };

  // Handle resolve confirmation
  const handleResolveConfirm = async (resolvedData: ResolvedData) => {
    if (!selectedOrder) return;

    setUpdatingOrderIds(prev => new Set([...prev, selectedOrder.id]));
    
    try {
      await resolveOrderFlag(selectedOrder.id, resolvedData);
      console.log(`✅ Order ${selectedOrder.id} resolved`);
      setResolveModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error(`❌ Failed to resolve order ${selectedOrder.id}:`, error);
    } finally {
      setUpdatingOrderIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedOrder.id);
        return newSet;
      });
    }
  };

  // Close modals
  const handleModalClose = () => {
    setRefundModalOpen(false);
    setFlaggedModalOpen(false);
    setResolveModalOpen(false);
    setSelectedOrder(null);
  };

  // Get CSS class for order row based on status
  const getOrderRowClassName = (order: EmailOrder): string => {
    switch (order.status) {
      case 'fulfilled':
        // Light green for previously flagged orders that are now resolved
        if (order.wasEverFlagged) {
          return styles.orderRowResolved;
        }
        // Normal fulfilled order
        return styles.orderRowFulfilled;
      case 'flagged':
        // Orange for flagged orders
        return styles.orderRowFlagged;
      case 'refunded':
        // Gray for refunded orders
        return styles.orderRowRefunded;
      case 'resolved':
        // Light green for resolved orders
        return styles.orderRowResolved;
      default:
        return '';
    }
  };

  // Helper functions for refunded order styling
  const getCostClassName = (order: EmailOrder): string => {
    if (order.status === 'refunded' && order.customerReturningItems) {
      return `${styles.cost} ${styles.strikethrough}`;
    }
    return styles.cost;
  };

  const getRevenueClassName = (order: EmailOrder): string => {
    if (order.status === 'refunded') {
      return `${styles.revenue} ${styles.strikethrough}`;
    }
    return styles.revenue;
  };

  if (loading) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.header}>
          <h2>Fulfilled Orders - {getCurrentMonthName()}</h2>
        </div>
        <div className={styles.loading}>Loading fulfilled orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.header}>
          <h2>Fulfilled Orders - {getCurrentMonthName()}</h2>
        </div>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h2>Fulfilled Orders - {getCurrentMonthName()}</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Orders:</span>
            <span className={styles.statValue}>{monthlyStats.totalOrders}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Gross Revenue:</span>
            <span className={styles.statValue}>${monthlyStats.grossRevenue.toFixed(2)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Etsy Fees:</span>
            <span className={styles.statValue}>-${monthlyStats.totalEtsyFees.toFixed(2)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Net Revenue:</span>
            <span className={styles.statValue}>${monthlyStats.netRevenue.toFixed(2)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Cost:</span>
            <span className={styles.statValue}>${monthlyStats.totalCosts.toFixed(2)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Profit:</span>
            <span className={`${styles.statValue} ${monthlyStats.totalProfit >= 0 ? styles.positive : styles.negative}`}>
              ${monthlyStats.totalProfit.toFixed(2)}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Avg Cost:</span>
            <span className={styles.statValue}>${monthlyStats.averageCostPerOrder.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {fulfilledOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No fulfilled orders found for {getCurrentMonthName()}</p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Order</div>
            <div className={styles.headerCell}>Store</div>
            <div className={styles.headerCell}>Method</div>
            <div className={styles.headerCell}>Fulfilled</div>
            <div className={styles.headerCell}>Cost</div>
            <div className={styles.headerCell}>Revenue</div>
            <div className={styles.headerCell}>Actions</div>
          </div>
          
          {fulfilledOrders.map((order) => (
            <div key={order.id} className={`${styles.orderRow} ${getOrderRowClassName(order)}`}>
              <div className={styles.cell}>
                <div className={styles.orderInfo}>
                  <span className={styles.orderNumber}>{order.orderNumber}</span>
                  {/* Show indicators for flagged, resolved, and refunded orders */}
                  {(order.status === 'flagged' || 
                    (order.status === 'resolved' && order.wasEverFlagged) || 
                    order.status === 'refunded') && (
                    <OrderTooltip content={
                      order.status === 'resolved' ? (order.resolvedDescription || '') :
                      order.status === 'flagged' ? (order.issueDescription || '') :
                      order.status === 'refunded' ? (order.refundReason || '') : ''
                    }>
                      <span className={styles.issueIndicator}>
                        {order.status === 'flagged' ? '🚩' : 
                         order.status === 'resolved' ? '✅' : 
                         order.status === 'refunded' ? '↩️' : '⚠️'}
                      </span>
                    </OrderTooltip>
                  )}
                </div>
              </div>
              <div className={styles.cell}>
                <span className={styles.store}>{order.store}</span>
              </div>
              <div className={styles.cell}>
                <span className={styles.fulfillmentMethod}>
                  {order.fulfilledAt || 'Not specified'}
                </span>
              </div>
              <div className={styles.cell}>
                <div className={styles.fulfillmentInfo}>
                  <span className={styles.fulfillmentDate}>
                    {order.updatedAt ? formatFulfillmentDate(order.updatedAt) : 'N/A'}
                  </span>
                  <span className={styles.daysAgo}>
                    {order.updatedAt ? 
                      formatDaysAgoText(getDaysSinceFulfillment(order.updatedAt)) 
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
              <div className={styles.cell}>
                <span className={getCostClassName(order)}>
                  ${(order.fulfillmentCost || 0).toFixed(2)}
                </span>
              </div>
              <div className={styles.cell}>
                <span className={getRevenueClassName(order)}>
                                          ${(order.amountAUD || 0).toFixed(2)}
                </span>
              </div>
              <div className={styles.cell}>
                <div className={styles.actions}>
                  {/* Show different buttons based on order status */}
                  {order.status === 'fulfilled' && (
                    <>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleRefundClick(order)}
                        disabled={updatingOrderIds.has(order.id)}
                      >
                        {updatingOrderIds.has(order.id) ? 'Processing...' : 'Refund'}
                      </button>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleFlaggedClick(order)}
                        disabled={updatingOrderIds.has(order.id)}
                      >
                        {updatingOrderIds.has(order.id) ? 'Processing...' : 'Flag'}
                      </button>
                    </>
                  )}
                  
                  {order.status === 'flagged' && (
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleResolveClick(order)}
                      disabled={updatingOrderIds.has(order.id)}
                    >
                      {updatingOrderIds.has(order.id) ? 'Resolving...' : 'Resolve'}
                    </button>
                  )}
                  
                  {(order.status === 'refunded') && (
                    <span className={styles.statusText}>
                      Refunded
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedOrder && (
        <>
          <RefundModal
            order={selectedOrder}
            isOpen={refundModalOpen}
            onClose={handleModalClose}
            onConfirm={handleRefundConfirm}
            isSubmitting={updatingOrderIds.has(selectedOrder.id)}
          />
          <FlaggedModal
            order={selectedOrder}
            isOpen={flaggedModalOpen}
            onClose={handleModalClose}
            onConfirm={handleFlaggedConfirm}
            isSubmitting={updatingOrderIds.has(selectedOrder.id)}
          />
          <ResolveModal
            isOpen={resolveModalOpen}
            onClose={handleModalClose}
            onConfirm={handleResolveConfirm}
            orderNumber={selectedOrder.orderNumber}
          />
        </>
      )}
    </div>
  );
};

export default FulfilledOrdersList; 