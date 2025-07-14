import React, { useState } from 'react';
import { EmailOrder } from '../../../services/emailOrderService';
import styles from './FulfillmentModal.module.css';

interface FulfillmentData {
  confirmedFulfilled: boolean;
  fulfilledAt: string;
  fulfillmentCost: number;
}

interface FulfillmentErrors {
  confirmedFulfilled?: boolean;
  fulfilledAt?: boolean;
  fulfillmentCost?: boolean;
}

interface FulfillmentModalProps {
  order: EmailOrder;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: FulfillmentData) => void;
  isSubmitting?: boolean;
}

export const FulfillmentModal: React.FC<FulfillmentModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<FulfillmentData>({
    confirmedFulfilled: false,
    fulfilledAt: '',
    fulfillmentCost: 0
  });

  const [errors, setErrors] = useState<FulfillmentErrors>({});

  const handleInputChange = (field: keyof FulfillmentData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FulfillmentErrors = {};

    if (!formData.confirmedFulfilled) {
      newErrors.confirmedFulfilled = true;
    }

    if (!formData.fulfilledAt.trim()) {
      newErrors.fulfilledAt = true;
    }

    if (formData.fulfillmentCost <= 0) {
      newErrors.fulfillmentCost = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onConfirm(formData);
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      confirmedFulfilled: false,
      fulfilledAt: '',
      fulfillmentCost: 0
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Confirm Order Fulfillment</h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className={styles.orderInfo}>
          <p><strong>Order:</strong> {order.orderNumber}</p>
          <p><strong>Store:</strong> {order.store}</p>
          <p><strong>Amount:</strong> {order.amountAUD} AUD</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.confirmedFulfilled}
                onChange={(e) => handleInputChange('confirmedFulfilled', e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                I confirm this order has been fulfilled
              </span>
            </label>
            {errors.confirmedFulfilled && (
              <span className={styles.error}>Please confirm the order has been fulfilled</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Where was it fulfilled?
              <input
                type="text"
                value={formData.fulfilledAt}
                onChange={(e) => handleInputChange('fulfilledAt', e.target.value)}
                className={`${styles.input} ${errors.fulfilledAt ? styles.inputError : ''}`}
                placeholder="e.g., Local supplier, AliExpress, etc."
              />
            </label>
            {errors.fulfilledAt && (
              <span className={styles.error}>Please specify where it was fulfilled</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Fulfillment Cost (AUD)
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.fulfillmentCost}
                onChange={(e) => handleInputChange('fulfillmentCost', parseFloat(e.target.value) || 0)}
                className={`${styles.input} ${errors.fulfillmentCost ? styles.inputError : ''}`}
                placeholder="0.00"
              />
            </label>
            {errors.fulfillmentCost && (
              <span className={styles.error}>Please enter a valid cost greater than 0</span>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.confirmButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Fulfilling...' : 'Confirm Fulfillment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FulfillmentModal;
export type { FulfillmentData }; 