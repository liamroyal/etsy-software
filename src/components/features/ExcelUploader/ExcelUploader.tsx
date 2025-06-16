import React, { useState } from 'react';
import { ExcelService } from '../../../services/excelService';
import { trackingService } from '../../../services/trackingService';
import { Order, OrderValidationResult } from '../../../types/order';
import styles from './ExcelUploader.module.css';

export const ExcelUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<{
    total: number;
    processed: number;
    successful: number;
    failed: number;
  } | null>(null);
  const [validationResult, setValidationResult] = useState<OrderValidationResult | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setValidationResult(null);
      setUploadStats(null);

      // Process Excel file
      const result = await ExcelService.processExcelFile(file);
      setValidationResult(result);

      if (result.valid.length === 0) {
        throw new Error('No valid orders found in the file');
      }

      // Upload valid orders
      const stats = {
        total: result.valid.length,
        processed: 0,
        successful: 0,
        failed: 0
      };
      setUploadStats(stats);

      // Process orders sequentially
      for (const order of result.valid) {
        try {
          await trackingService.addOrder(order);
          stats.successful++;
        } catch (error) {
          stats.failed++;
          result.invalid.push({
            orderNumber: order.orderNumber,
            trackingNumber: order.trackingNumber,
            errors: [(error as Error).message]
          });
        }
        stats.processed++;
        setUploadStats({ ...stats });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadSection}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={isUploading}
          className={styles.fileInput}
        />
        {isUploading && <div className={styles.loading}>Processing file...</div>}
      </div>

      {uploadStats && (
        <div className={styles.stats}>
          <h3>Upload Progress</h3>
          <p>Total Orders: {uploadStats.total}</p>
          <p>Processed: {uploadStats.processed}</p>
          <p>Successful: {uploadStats.successful}</p>
          <p>Failed: {uploadStats.failed}</p>
        </div>
      )}

      {validationResult && validationResult.invalid.length > 0 && (
        <div className={styles.errors}>
          <h3>Invalid Entries</h3>
          <ul>
            {validationResult.invalid.map((invalid, index) => (
              <li key={index}>
                Order: {invalid.orderNumber || 'N/A'}, 
                Tracking: {invalid.trackingNumber || 'N/A'}
                <ul>
                  {invalid.errors.map((error, errIndex) => (
                    <li key={errIndex}>{error}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 