import React, { useState } from 'react';
import { EmailOrder } from '../../../services/emailOrderService';
import { updateOrderWithFulfillment, FulfillmentData } from '../../../services/orderUpdateService';
import { FulfillmentModal } from './FulfillmentModal';
import styles from './StatusUpdateButton.module.css';

interface StatusUpdateButtonProps {
  order: EmailOrder;
  onStatusUpdate?: (orderId: string, newStatus: 'pending' | 'overdue' | 'fulfilled' | 'refunded') => void;
  disabled?: boolean;
}

export const StatusUpdateButton: React.FC<StatusUpdateButtonProps> = ({ 
  order, 
  onStatusUpdate, 
  disabled = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFulfilling, setIsFulfilling] = useState(false);

  // Only show fulfill button if order is not already fulfilled
  const canFulfill = order.status !== 'fulfilled';

  const handleFulfillClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFulfillmentConfirm = async (fulfillmentData: FulfillmentData) => {
    setIsFulfilling(true);

    try {
      // Update order with fulfillment data
      await updateOrderWithFulfillment(order.id, fulfillmentData);
      
      // Post-fulfillment logic placeholder
      await handlePostFulfillmentActions(order);
      
      if (onStatusUpdate) {
        onStatusUpdate(order.id, 'fulfilled');
      }

      // Close modal on success
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to fulfill order:', error);
      // You could add a toast notification here
    } finally {
      setIsFulfilling(false);
    }
  };

  // Placeholder for post-fulfillment logic
  const handlePostFulfillmentActions = async (order: EmailOrder) => {
    console.log(`🚀 Post-fulfillment actions for order ${order.orderNumber}:`);
    console.log('📋 TODO: Implement post-fulfillment logic here');
    
    // TODO: Add post-fulfillment logic here such as:
    // - Move to fulfilled orders collection
    // - Update inventory
    // - Send confirmation emails
    // - Generate reports
    // - Archive order data
    // - etc.
    
    // For now, just log the action
    console.log(`✅ Order ${order.orderNumber} fulfilled successfully`);
  };

  if (!canFulfill) {
    return (
      <div className={styles.statusInfo}>
        <span className={styles.fulfilledText}>Fulfilled</span>
      </div>
    );
  }

  return (
    <>
      <button
        className={`${styles.fulfillButton} ${isFulfilling ? styles.fulfilling : ''}`}
        onClick={handleFulfillClick}
        disabled={disabled || isFulfilling}
        aria-label={`Fulfill order ${order.orderNumber}`}
      >
        <span className={styles.buttonText}>
          {isFulfilling ? 'Fulfilling...' : 'Fulfill Order'}
        </span>
      </button>

      <FulfillmentModal
        order={order}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleFulfillmentConfirm}
        isSubmitting={isFulfilling}
      />
    </>
  );
};

export default StatusUpdateButton; 