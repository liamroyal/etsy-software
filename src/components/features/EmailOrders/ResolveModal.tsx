import React, { useState } from 'react';
import styles from './ResolveModal.module.css';

interface ResolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { confirmed: boolean; resolvedDescription: string }) => void;
  orderNumber: string;
}

export const ResolveModal: React.FC<ResolveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [resolvedDescription, setResolvedDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed || !resolvedDescription.trim()) {
      return;
    }
    
    onConfirm({
      confirmed,
      resolvedDescription: resolvedDescription.trim(),
    });
    
    // Reset form
    setConfirmed(false);
    setResolvedDescription('');
    onClose();
  };

  const handleCancel = () => {
    setConfirmed(false);
    setResolvedDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Resolve Order #{orderNumber}</h3>
          <button className={styles.closeButton} onClick={handleCancel}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className={styles.checkbox}
              />
              I confirm that this order has been successfully resolved
            </label>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="resolvedDescription" className={styles.label}>
              Resolution Description *
            </label>
            <textarea
              id="resolvedDescription"
              value={resolvedDescription}
              onChange={(e) => setResolvedDescription(e.target.value)}
              placeholder="Describe how this issue was resolved..."
              className={styles.textarea}
              rows={4}
              required
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confirmed || !resolvedDescription.trim()}
              className={styles.confirmButton}
            >
              Resolve Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 