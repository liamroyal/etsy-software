import React, { useState } from 'react';
import { EmailOrder } from '../../../services/emailOrderService';
import { RefundData } from '../../../services/orderUpdateService';
import styles from './RefundModal.module.css';

interface RefundModalProps {
  order: EmailOrder;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: RefundData) => void;
  isSubmitting?: boolean;
}

interface RefundErrors {
  refundReason?: boolean;
  refundPercentage?: boolean;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<RefundData>({
    refundReason: '',
    refundPercentage: 0,
    customerReturningItems: false
  });

  const [errors, setErrors] = useState<RefundErrors>({});

  const handleInputChange = (field: keyof RefundData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof RefundErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RefundErrors = {};

    if (!formData.refundReason.trim()) {
      newErrors.refundReason = true;
    }

    if (formData.refundPercentage <= 0 || formData.refundPercentage > 100) {
      newErrors.refundPercentage = true;
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
      refundReason: '',
      refundPercentage: 0,
      customerReturningItems: false
    });
    setErrors({});
    onClose();
  };

  const calculateRefundAmount = () => {
    const originalAmount = parseFloat(order.amountAUD || '0');
    const refundAmount = (originalAmount * formData.refundPercentage) / 100;
    return refundAmount.toFixed(2);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Process Refund</h2>
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
          <p><strong>Original Amount:</strong> ${order.amountAUD} AUD</p>
          {formData.refundPercentage > 0 && (
            <p><strong>Refund Amount:</strong> ${calculateRefundAmount()} AUD</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Refund Reason
              <textarea
                value={formData.refundReason}
                onChange={(e) => handleInputChange('refundReason', e.target.value)}
                className={`${styles.textarea} ${errors.refundReason ? styles.inputError : ''}`}
                placeholder="Describe the reason for the refund..."
                rows={3}
              />
            </label>
            {errors.refundReason && (
              <span className={styles.error}>Please provide a refund reason</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Refund Percentage
              <input
                type="number"
                step="1"
                min="1"
                max="100"
                value={formData.refundPercentage}
                onChange={(e) => handleInputChange('refundPercentage', parseInt(e.target.value) || 0)}
                className={`${styles.input} ${errors.refundPercentage ? styles.inputError : ''}`}
                placeholder="0"
              />
              <span className={styles.inputHelper}>Enter percentage (1-100%)</span>
            </label>
            {errors.refundPercentage && (
              <span className={styles.error}>Please enter a valid percentage between 1-100%</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.customerReturningItems}
                onChange={(e) => handleInputChange('customerReturningItems', e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                Customer is returning items
              </span>
            </label>
            <p className={styles.returnInfo}>
              {formData.customerReturningItems 
                ? "✅ Both revenue and fulfillment cost will be set to $0" 
                : "ℹ️ Only revenue will be adjusted, fulfillment cost remains"
              }
            </p>
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
              {isSubmitting ? 'Processing Refund...' : 'Process Refund'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundModal; 