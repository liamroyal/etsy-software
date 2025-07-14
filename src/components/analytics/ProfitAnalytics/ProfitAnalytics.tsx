import React from 'react';
import { MonthlyFinancialStats, formatFinancialAmount, formatPercentage } from '../../../services/financialCalculationService';
import { FinancialBreakdown } from '../../common/FinancialBreakdown';
import styles from './ProfitAnalytics.module.css';

interface ProfitAnalyticsProps {
  monthlyStats: MonthlyFinancialStats;
  title?: string;
  showTrends?: boolean;
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, trend, className = '' }) => (
  <div className={`${styles.metricCard} ${className}`}>
    <div className={styles.metricTitle}>{title}</div>
    <div className={`${styles.metricValue} ${trend ? styles[trend] : ''}`}>
      {value}
      {trend && (
        <span className={styles.trendIcon}>
          {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️'}
        </span>
      )}
    </div>
    {subtitle && <div className={styles.metricSubtitle}>{subtitle}</div>}
  </div>
);

export const ProfitAnalytics: React.FC<ProfitAnalyticsProps> = ({
  monthlyStats,
  title = "Profit Analytics",
  showTrends = true,
  className = ''
}) => {
  // Calculate additional metrics
  const totalRevenue = monthlyStats.grossRevenue;
  const etsyFeePercentage = totalRevenue > 0 ? (monthlyStats.totalEtsyFees / totalRevenue) * 100 : 0;
  const costEfficiencyRatio = monthlyStats.netRevenue > 0 ? (monthlyStats.totalCosts / monthlyStats.netRevenue) * 100 : 0;
  const averageRevenuePerOrder = monthlyStats.totalOrders > 0 ? totalRevenue / monthlyStats.totalOrders : 0;
  const averageEtsyFeePerOrder = monthlyStats.totalOrders > 0 ? monthlyStats.totalEtsyFees / monthlyStats.totalOrders : 0;

  // Create overall financial breakdown for display
  const overallBreakdown = {
    grossRevenue: monthlyStats.grossRevenue,
    etsyFeePercentage: etsyFeePercentage,
    etsyFeeAmount: monthlyStats.totalEtsyFees,
    netRevenue: monthlyStats.netRevenue,
    fulfillmentCosts: monthlyStats.totalCosts,
    profit: monthlyStats.totalProfit,
    profitMarginPercentage: monthlyStats.profitMarginPercentage
  };

  // Determine trend indicators (simplified - in real app would compare to previous period)
  const getTrend = (value: number): 'up' | 'down' | 'neutral' => {
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {title && <h2 className={styles.title}>{title}</h2>}
      
      {/* Key Metrics Grid */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Total Orders"
          value={monthlyStats.totalOrders.toString()}
          subtitle="Current month"
          trend="neutral"
        />
        
        <MetricCard
          title="Average Profit/Order"
          value={formatFinancialAmount(monthlyStats.averageProfitPerOrder)}
          subtitle="After all fees & costs"
          trend={getTrend(monthlyStats.averageProfitPerOrder)}
        />
        
        <MetricCard
          title="Profit Margin"
          value={formatPercentage(monthlyStats.profitMarginPercentage)}
          subtitle="Profit / Gross Revenue"
          trend={getTrend(monthlyStats.profitMarginPercentage)}
        />
        
        <MetricCard
          title="Cost Efficiency"
          value={formatPercentage(costEfficiencyRatio)}
          subtitle="Costs / Net Revenue"
          trend={costEfficiencyRatio < 50 ? 'up' : costEfficiencyRatio > 80 ? 'down' : 'neutral'}
        />
      </div>

      {/* Detailed Revenue Breakdown */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Revenue Breakdown</h3>
        <div className={styles.revenueGrid}>
          <MetricCard
            title="Gross Revenue"
            value={formatFinancialAmount(monthlyStats.grossRevenue)}
            subtitle="Before any deductions"
          />
          
          <MetricCard
            title="Etsy Fees"
            value={formatFinancialAmount(monthlyStats.totalEtsyFees)}
            subtitle={`${formatPercentage(etsyFeePercentage)} of gross`}
          />
          
          <MetricCard
            title="Net Revenue"
            value={formatFinancialAmount(monthlyStats.netRevenue)}
            subtitle="After Etsy fees"
          />
          
          <MetricCard
            title="Final Profit"
            value={formatFinancialAmount(monthlyStats.totalProfit)}
            subtitle="After all costs"
            trend={getTrend(monthlyStats.totalProfit)}
          />
        </div>
      </div>

      {/* Per-Order Analytics */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Per-Order Analytics</h3>
        <div className={styles.perOrderGrid}>
          <MetricCard
            title="Avg Revenue/Order"
            value={formatFinancialAmount(averageRevenuePerOrder)}
            subtitle="Gross revenue per order"
          />
          
          <MetricCard
            title="Avg Etsy Fee/Order"
            value={formatFinancialAmount(averageEtsyFeePerOrder)}
            subtitle="Commission per order"
          />
          
          <MetricCard
            title="Avg Cost/Order"
            value={formatFinancialAmount(monthlyStats.averageCostPerOrder)}
            subtitle="Fulfillment per order"
          />
          
          <MetricCard
            title="Avg Profit/Order"
            value={formatFinancialAmount(monthlyStats.averageProfitPerOrder)}
            subtitle="Net profit per order"
            trend={getTrend(monthlyStats.averageProfitPerOrder)}
          />
        </div>
      </div>

      {/* Efficiency Ratios */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Efficiency Ratios</h3>
        <div className={styles.ratioGrid}>
          <div className={styles.ratioCard}>
            <div className={styles.ratioTitle}>Etsy Fee Rate</div>
            <div className={styles.ratioValue}>{formatPercentage(etsyFeePercentage)}</div>
            <div className={styles.ratioDescription}>
              Etsy takes {formatFinancialAmount(monthlyStats.totalEtsyFees)} of your {formatFinancialAmount(monthlyStats.grossRevenue)} gross revenue
            </div>
          </div>
          
          <div className={styles.ratioCard}>
            <div className={styles.ratioTitle}>Cost Efficiency</div>
            <div className={`${styles.ratioValue} ${costEfficiencyRatio < 50 ? styles.good : costEfficiencyRatio > 80 ? styles.poor : styles.average}`}>
              {formatPercentage(costEfficiencyRatio)}
            </div>
            <div className={styles.ratioDescription}>
              Your costs are {formatPercentage(costEfficiencyRatio)} of your net revenue
              {costEfficiencyRatio < 50 && ' (Excellent!)'}
              {costEfficiencyRatio > 80 && ' (Needs improvement)'}
            </div>
          </div>
          
          <div className={styles.ratioCard}>
            <div className={styles.ratioTitle}>Profit Conversion</div>
            <div className={`${styles.ratioValue} ${monthlyStats.profitMarginPercentage > 20 ? styles.good : monthlyStats.profitMarginPercentage < 10 ? styles.poor : styles.average}`}>
              {formatPercentage(monthlyStats.profitMarginPercentage)}
            </div>
            <div className={styles.ratioDescription}>
              You convert {formatPercentage(monthlyStats.profitMarginPercentage)} of gross revenue to profit
            </div>
          </div>
        </div>
      </div>

      {/* Overall Financial Breakdown */}
      <div className={styles.section}>
        <FinancialBreakdown 
          breakdown={overallBreakdown}
          title="Complete Financial Analysis"
          showDetailedBreakdown={true}
          period="monthly"
        />
      </div>

      {/* Insights & Recommendations */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Insights & Recommendations</h3>
        <div className={styles.insights}>
          {monthlyStats.profitMarginPercentage > 25 && (
            <div className={styles.insight}>
              <span className={styles.insightIcon}>🎉</span>
              <div className={styles.insightText}>
                <strong>Excellent profit margin!</strong> Your {formatPercentage(monthlyStats.profitMarginPercentage)} margin is well above industry average.
              </div>
            </div>
          )}
          
          {monthlyStats.profitMarginPercentage < 10 && (
            <div className={styles.insight}>
              <span className={styles.insightIcon}>⚠️</span>
              <div className={styles.insightText}>
                <strong>Low profit margin.</strong> Consider optimizing costs or increasing prices to improve profitability.
              </div>
            </div>
          )}
          
          {costEfficiencyRatio > 70 && (
            <div className={styles.insight}>
              <span className={styles.insightIcon}>💡</span>
              <div className={styles.insightText}>
                <strong>High fulfillment costs.</strong> Your costs are {formatPercentage(costEfficiencyRatio)} of net revenue. Look for ways to reduce fulfillment expenses.
              </div>
            </div>
          )}
          
          {monthlyStats.averageProfitPerOrder > 10 && (
            <div className={styles.insight}>
              <span className={styles.insightIcon}>✅</span>
              <div className={styles.insightText}>
                <strong>Strong per-order profitability.</strong> Your average profit of {formatFinancialAmount(monthlyStats.averageProfitPerOrder)} per order shows healthy unit economics.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 