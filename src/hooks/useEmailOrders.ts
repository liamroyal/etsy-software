import { useState, useEffect } from 'react';
import { subscribeToEmailOrders, EmailOrdersResult } from '../services/emailOrderService';

export const useEmailOrders = (
  limitCount?: number,
  dateRange?: { startDate?: Date; endDate?: Date }
) => {
  const [emailOrdersState, setEmailOrdersState] = useState<EmailOrdersResult>({
    orders: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = subscribeToEmailOrders(setEmailOrdersState, limitCount, dateRange);
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [limitCount, dateRange?.startDate?.getTime(), dateRange?.endDate?.getTime()]); // Use getTime() to avoid Date object comparison issues

  return emailOrdersState;
}; 