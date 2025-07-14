import React, { useState } from 'react';
import { FinancialBreakdown as FinancialBreakdownType, formatFinancialAmount, formatPercentage } from '../../../services/financialCalculationService';
import styles from './FinancialBreakdown.module.css';

interface FinancialBreakdownProps {
  breakdown: FinancialBreakdownType;
  title?: string;
  showDetailedBreakdown?: boolean;
  className?: string;
  period?: 'daily' | 'weekly' | 'monthly';
}

export const FinancialBreakdown: React.FC<FinancialBreakdownProps> = ({
  breakdown,
  title = "Financial Summary",
  showDetailedBreakdown = true,
  className = '',
  period = 'daily'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'Daily';
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      
      {/* Key Metrics Display */}
      <div className={styles.keyMetrics}>
        <div className={`${styles.metricCard} ${styles.revenueCard}`}>
          <div className={styles.metricLabel}>
            {getPeriodLabel(period)} Revenue
          </div>
          <div className={`${styles.metricValue} ${styles.revenueValue}`}>
            {formatFinancialAmount(breakdown.netRevenue)}
          </div>
          <div className={styles.metricSubtext}>
            After Etsy fees ({formatPercentage(breakdown.etsyFeePercentage)})
          </div>
        </div>

        <div className={`${styles.metricCard} ${breakdown.profit >= 0 ? styles.profitCard : styles.lossCard}`}>
          <div className={styles.metricLabel}>
            {getPeriodLabel(period)} Profit
          </div>
          <div className={`${styles.metricValue} ${breakdown.profit >= 0 ? styles.profitPositive : styles.profitNegative}`}>
            {formatFinancialAmount(breakdown.profit)}
          </div>
          <div className={styles.metricSubtext}>
            {breakdown.profitMarginPercentage >= 0 
              ? `${formatPercentage(breakdown.profitMarginPercentage)} margin`
              : 'Loss'
            }
          </div>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      {showDetailedBreakdown && (
        <button 
          className={`${styles.expandButton} ${isExpanded ? styles.expandButtonActive : ''}`}
          onClick={toggleExpanded}
        >
          <span className={styles.expandIcon}>
            {isExpanded ? '▲' : '▼'}
          </span>
          <span className={styles.expandText}>
            {isExpanded ? 'Hide Details' : 'Show Breakdown'}
          </span>
        </button>
      )}

      {/* Detailed Breakdown - Collapsible */}
      {showDetailedBreakdown && isExpanded && (
        <div className={styles.detailedBreakdown}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.descriptionHeader}>Description</th>
                  <th className={styles.amountHeader}>Amount</th>
                  <th className={styles.runningTotalHeader}>Running Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Gross Revenue */}
                <tr className={styles.revenueRow}>
                  <td className={styles.description}>
                    <div className={styles.descriptionContent}>
                      <span className={styles.mainLabel}>Gross Revenue</span>
                      <span className={styles.subLabel}>Total sales from Etsy</span>
                    </div>
                  </td>
                  <td className={styles.amount}>
                    <span className={styles.positiveAmount}>
                      {formatFinancialAmount(breakdown.grossRevenue)}
                    </span>
                  </td>
                  <td className={styles.runningTotal}>
                    {formatFinancialAmount(breakdown.grossRevenue)}
                  </td>
                </tr>

                {/* Etsy Fees */}
                <tr className={styles.deductionRow}>
                  <td className={styles.description}>
                    <div className={styles.descriptionContent}>
                      <span className={styles.mainLabel}>Etsy Platform Fees</span>
                      <span className={styles.subLabel}>
                        {formatPercentage(breakdown.etsyFeePercentage)} of gross revenue
                      </span>
                    </div>
                  </td>
                  <td className={styles.amount}>
                    <span className={styles.negativeAmount}>
                      -{formatFinancialAmount(breakdown.etsyFeeAmount)}
                    </span>
                  </td>
                  <td className={styles.runningTotal}>
                    {formatFinancialAmount(breakdown.netRevenue)}
                  </td>
                </tr>

                {/* Net Revenue Subtotal */}
                <tr className={styles.subtotalRow}>
                  <td className={styles.description}>
                    <div className={styles.descriptionContent}>
                      <span className={styles.mainLabel}>Net Revenue</span>
                      <span className={styles.subLabel}>Revenue after platform fees</span>
                    </div>
                  </td>
                  <td className={styles.amount}>
                    <span className={styles.subtotalAmount}>
                      {formatFinancialAmount(breakdown.netRevenue)}
                    </span>
                  </td>
                  <td className={styles.runningTotal}>
                    {formatFinancialAmount(breakdown.netRevenue)}
                  </td>
                </tr>

                {/* Fulfillment Costs */}
                <tr className={styles.deductionRow}>
                  <td className={styles.description}>
                    <div className={styles.descriptionContent}>
                      <span className={styles.mainLabel}>Fulfillment Costs</span>
                      <span className={styles.subLabel}>Product costs, shipping, etc.</span>
                    </div>
                  </td>
                  <td className={styles.amount}>
                    <span className={styles.negativeAmount}>
                      -{formatFinancialAmount(breakdown.fulfillmentCosts)}
                    </span>
                  </td>
                  <td className={styles.runningTotal}>
                    {formatFinancialAmount(breakdown.profit)}
                  </td>
                </tr>

                {/* Final Profit */}
                <tr className={styles.totalRow}>
                  <td className={styles.description}>
                    <div className={styles.descriptionContent}>
                      <span className={styles.mainLabel}>Final Profit</span>
                      <span className={styles.subLabel}>
                        {breakdown.profitMarginPercentage >= 0 ? 'Profit' : 'Loss'} after all expenses
                      </span>
                    </div>
                  </td>
                  <td className={styles.amount}>
                    <span className={`${styles.finalAmount} ${breakdown.profit >= 0 ? styles.positiveAmount : styles.negativeAmount}`}>
                      {formatFinancialAmount(breakdown.profit)}
                    </span>
                  </td>
                  <td className={styles.runningTotal}>
                    <span className={breakdown.profit >= 0 ? styles.positiveAmount : styles.negativeAmount}>
                      {formatFinancialAmount(breakdown.profit)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}; 