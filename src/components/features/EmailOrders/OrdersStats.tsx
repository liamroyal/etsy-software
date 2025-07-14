import React from 'react';
import { useEmailOrders } from '../../../hooks/useEmailOrders';
import { EmailOrder, getOrderDate } from '../../../services/emailOrderService';
import { calculateMonthlyFinancialStats, formatFinancialAmount, MonthlyFinancialStats, FinancialBreakdown as FinancialBreakdownType } from '../../../services/financialCalculationService';
import { FinancialBreakdown } from '../../common/FinancialBreakdown';
import styles from './OrdersStats.module.css';

interface OrdersStatsProps {
  limit?: number;
}

export const OrdersStats: React.FC<OrdersStatsProps> = ({ limit }) => {
  // Simplified: Load recent orders without date range (fix loading issue)
  const { orders, loading } = useEmailOrders(limit);

  const calculatePeriodStats = (orders: EmailOrder[], periodType: 'daily' | 'weekly' | 'monthly') => {
    const now = new Date();
    let startDate: Date;

    if (periodType === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (periodType === 'weekly') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Filter orders for the specific period
    const periodOrders = orders.filter(order => {
      if (order.type === 'REFUND' || order.status === 'refunded') return false;
      const orderDate = getOrderDate(order.receivedAt);
      return orderDate >= startDate;
    });

    return calculateMonthlyFinancialStats(periodOrders);
  };

  // Convert MonthlyFinancialStats to FinancialBreakdown format
  const convertToFinancialBreakdown = (stats: MonthlyFinancialStats): FinancialBreakdownType => {
    return {
      grossRevenue: stats.grossRevenue,
      etsyFeePercentage: 11.5, // Standard Etsy fee percentage
      etsyFeeAmount: stats.totalEtsyFees,
      netRevenue: stats.netRevenue,
      fulfillmentCosts: stats.totalCosts,
      profit: stats.totalProfit,
      profitMarginPercentage: stats.profitMarginPercentage
    };
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading stats...</span>
        </div>
      </div>
    );
  }

  const dailyStats = calculatePeriodStats(orders, 'daily');
  const weeklyStats = calculatePeriodStats(orders, 'weekly');
  const monthlyStats = calculatePeriodStats(orders, 'monthly');

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        {/* Daily Stats */}
        <div className={styles.periodSection}>
          <FinancialBreakdown 
            breakdown={convertToFinancialBreakdown(dailyStats)}
            title="TODAY"
            period="daily"
            showDetailedBreakdown={true}
          />
          <div className={styles.orderCount}>{dailyStats.totalOrders} orders</div>
        </div>

        {/* Weekly Stats */}
        <div className={styles.periodSection}>
          <FinancialBreakdown 
            breakdown={convertToFinancialBreakdown(weeklyStats)}
            title="THIS WEEK"
            period="weekly"
            showDetailedBreakdown={true}
          />
          <div className={styles.orderCount}>{weeklyStats.totalOrders} orders</div>
        </div>

        {/* Monthly Stats */}
        <div className={styles.periodSection}>
          <FinancialBreakdown 
            breakdown={convertToFinancialBreakdown(monthlyStats)}
            title="THIS MONTH"
            period="monthly"
            showDetailedBreakdown={true}
          />
          <div className={styles.orderCount}>{monthlyStats.totalOrders} orders</div>
        </div>
      </div>
    </div>
  );
}; 