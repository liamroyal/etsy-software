import React, { useState } from 'react';
import { StatusMessage } from './components/StatusMessage';
import { useTrackingForm } from './hooks/useTrackingForm';
import { ExcelUploader } from '../ExcelUploader/ExcelUploader';
import styles from './TrackingUploader.module.css';

interface Props {
  onUploadComplete?: () => void;
}

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  children: React.ReactNode;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ active, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={active ? styles.toggleButtonActive : styles.toggleButtonInactive}
  >
    <span>{icon}</span>
    {children}
  </button>
);

const ExampleSection: React.FC = () => (
  <div className={styles.exampleCard}>
    <span className={styles.exampleIcon}>📋</span>
    <div className={styles.exampleContent}>
      <div className={styles.exampleTitle}>Format Example</div>
      <pre className={styles.exampleCode}>#3695239669 UK216203823YP
#3687092512 YT2514900706969900</pre>
    </div>
  </div>
);

const ExcelRequirements: React.FC = () => (
  <div className={styles.excelRequirements}>
    <span className={styles.exampleIcon}>📊</span>
    <div className={styles.exampleContent}>
      <div className={styles.exampleTitle}>Excel File Requirements</div>
      <ul className={styles.requirementsList}>
        <li className={styles.requirementItem}>
          <span className={styles.monospace}>order-number</span> column for order numbers
        </li>
        <li className={styles.requirementItem}>
          <span className={styles.monospace}>Tracking</span> column for tracking numbers
        </li>
        <li className={styles.requirementItem}>
          File format: <span className={styles.monospace}>.xlsx</span> or <span className={styles.monospace}>.xls</span>
        </li>
      </ul>
    </div>
  </div>
);

export const TrackingUploader: React.FC<Props> = ({ onUploadComplete }) => {
  const [uploadMode, setUploadMode] = useState<'text' | 'excel'>('text');
  const [bulkInput, setBulkInput] = useState('');
  const { error, success, handleBulkSubmit } = useTrackingForm(onUploadComplete);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkInput.trim().split('\n');
    const orders = lines.map(line => {
      const [orderNumber, trackingNumber] = line.trim().split(/\s+/);
      return { orderNumber, trackingNumber };
    });
    await handleBulkSubmit(orders);
    if (!error) {
      setBulkInput('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Add Tracking Numbers</h1>
          <p className={styles.subtitle}>Upload tracking numbers individually or in bulk</p>
        </div>

        <div className={styles.modeToggle}>
          <div className={styles.toggleContainer}>
            <ToggleButton
              active={uploadMode === 'text'}
              onClick={() => setUploadMode('text')}
              icon="📝"
            >
              Text Input
            </ToggleButton>
            <ToggleButton
              active={uploadMode === 'excel'}
              onClick={() => setUploadMode('excel')}
              icon="📊"
            >
              Excel Upload
            </ToggleButton>
          </div>
        </div>

        <div>
          {uploadMode === 'text' ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="bulkInput" className={styles.label}>
                  Order Numbers and Tracking Numbers
                </label>
                <div className={styles.textareaContainer}>
                  <textarea
                    id="bulkInput"
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    className={styles.textarea}
                    placeholder="#3695239669 UK216203823YP"
                    rows={6}
                  />
                  {!bulkInput && (
                    <span className={styles.placeholderIcon}>📥</span>
                  )}
                </div>
                <div className={styles.formatHint}>
                  <span>Format: #OrderNumber TrackingNumber</span>
                  <span>One pair per line</span>
                </div>
              </div>

              <ExampleSection />

              <div className={styles.form}>
                <StatusMessage type="error" message={error} />
                <StatusMessage type="success" message={success} />
              </div>

              <button
                type="submit"
                disabled={!bulkInput.trim()}
                className={styles.submitButton}
              >
                Add Tracking Numbers
              </button>
            </form>
          ) : (
            <div className={styles.form}>
              <ExcelRequirements />
              <ExcelUploader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 