import { useState } from 'react';
import { trackingService } from '../../../../services/trackingService';
import { Order } from '../../../../types/order';

interface UseTrackingFormResult {
  error: string | null;
  success: string | null;
  handleBulkSubmit: (orders: { orderNumber: string; trackingNumber: string }[]) => Promise<void>;
}

export const useTrackingForm = (onUploadComplete?: () => void): UseTrackingFormResult => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleBulkSubmit = async (orders: { orderNumber: string; trackingNumber: string }[]) => {
    setError(null);
    setSuccess(null);

    try {
      let successCount = 0;
      let failureCount = 0;
      const errors: string[] = [];

      for (const { orderNumber, trackingNumber } of orders) {
        try {
          const order: Order = {
            orderNumber,
            trackingNumber,
            trackingLink: `https://parcelsapp.com/en/tracking/${trackingNumber}`,
            fulfilled: false
          };

          const result = await trackingService.addOrder(order);
          
          if (result.success) {
            successCount++;
          } else {
            failureCount++;
            errors.push(`${orderNumber}: ${result.message}`);
          }
        } catch (err) {
          failureCount++;
          errors.push(`${orderNumber}: Failed to add tracking number`);
        }
      }

      if (failureCount === 0) {
        setSuccess(`Successfully added ${successCount} tracking numbers`);
        onUploadComplete?.();
      } else {
        setError(`Added ${successCount} tracking numbers, failed to add ${failureCount} tracking numbers:\n${errors.join('\n')}`);
        if (successCount > 0) {
          onUploadComplete?.();
        }
      }
    } catch (err) {
      setError('Failed to process tracking numbers');
      console.error('Error:', err);
    }
  };

  return {
    error,
    success,
    handleBulkSubmit
  };
}; 