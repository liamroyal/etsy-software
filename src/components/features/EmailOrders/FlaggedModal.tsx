import React, { useState } from 'react';
import { EmailOrder } from '../../../services/emailOrderService';
import { FlaggedData } from '../../../services/orderUpdateService';
import styles from './FlaggedModal.module.css';

interface FlaggedModalProps {
  order: EmailOrder;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: FlaggedData) => void;
  isSubmitting?: boolean;
}

interface FlaggedErrors {
  issueDescription?: boolean;
}

export const FlaggedModal: React.FC<FlaggedModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<FlaggedData>({
    issueDescription: ''
  });

  const [errors, setErrors] = useState<FlaggedErrors>({});

  const handleInputChange = (value: string) => {
    setFormData({
      issueDescription: value
    });
    
    // Clear error when user starts typing
    if (errors.issueDescription) {
      setErrors({});
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FlaggedErrors = {};

    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = true;
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
      issueDescription: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Flag Order Issue</h2>
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
          <p><strong>Amount:</strong> ${order.amountAUD} AUD</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Issue Description
              <textarea
                value={formData.issueDescription}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`${styles.textarea} ${errors.issueDescription ? styles.inputError : ''}`}
                placeholder="Describe the issue with this order..."
                rows={4}
              />
            </label>
            <span className={styles.inputHelper}>
              Describe what went wrong with this order. This will be visible when hovering over the order.
            </span>
            {errors.issueDescription && (
              <span className={styles.error}>Please describe the issue</span>
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
              {isSubmitting ? 'Flagging Order...' : 'Flag Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlaggedModal; 