import { EmailOrder } from './emailOrderService';
import { MonthlyFinancialStats, calculateMonthlyFinancialStats, getOrderFinancialBreakdown } from './financialCalculationService';

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  summary: string;
}

export interface DiscrepancyReport {
  field: string;
  expectedValue: number;
  actualValue: number;
  difference: number;
  percentageDiff: number;
}

/**
 * Validate financial data consistency across orders
 */
export const validateFinancialConsistency = (orders: EmailOrder[]): ValidationResult => {
  const warnings: string[] = [];
  const errors: string[] = [];

  orders.forEach((order, index) => {
    // Check for missing financial data
    if (!order.amountAUD || order.amountAUD <= 0) {
      errors.push(`Order ${order.orderNumber}: Missing or invalid amountAUD (${order.amountAUD})`);
    }

    // Check for missing Etsy fee data on newer orders
    if (!order.etsyFeeAmount && order.amountAUD > 0) {
      warnings.push(`Order ${order.orderNumber}: Missing Etsy fee calculation - may be legacy order`);
    }

    // Check for missing net revenue calculation
    if (!order.netRevenue && order.amountAUD > 0) {
      warnings.push(`Order ${order.orderNumber}: Missing net revenue calculation`);
    }

    // Validate Etsy fee calculation if present
    if (order.etsyFeeAmount && order.amountAUD && order.etsyFeePercentage) {
      const expectedFee = (order.amountAUD * order.etsyFeePercentage) / 100;
      const actualFee = order.etsyFeeAmount;
      const diff = Math.abs(expectedFee - actualFee);
      
      if (diff > 0.01) { // Allow for small rounding differences
        warnings.push(
          `Order ${order.orderNumber}: Etsy fee mismatch - Expected: $${expectedFee.toFixed(2)}, Actual: $${actualFee.toFixed(2)}`
        );
      }
    }

    // Validate net revenue calculation if present
    if (order.netRevenue && order.amountAUD && order.etsyFeeAmount) {
      const expectedNet = order.amountAUD - order.etsyFeeAmount;
      const actualNet = order.netRevenue;
      const diff = Math.abs(expectedNet - actualNet);
      
      if (diff > 0.01) {
        warnings.push(
          `Order ${order.orderNumber}: Net revenue mismatch - Expected: $${expectedNet.toFixed(2)}, Actual: $${actualNet.toFixed(2)}`
        );
      }
    }

    // Check for suspicious refund data
    if (order.status === 'refunded') {
      if (!order.refundReason) {
        warnings.push(`Order ${order.orderNumber}: Refunded order missing refund reason`);
      }
      
      if (!order.refundPercentage) {
        warnings.push(`Order ${order.orderNumber}: Refunded order missing refund percentage`);
      }

      // Validate refund calculations
      if (order.originalAmountAUD && order.refundPercentage) {
        const expectedRefundAmount = (order.originalAmountAUD * order.refundPercentage) / 100;
        if (order.refundAmount && Math.abs(expectedRefundAmount - order.refundAmount) > 0.01) {
          warnings.push(
            `Order ${order.orderNumber}: Refund amount mismatch - Expected: $${expectedRefundAmount.toFixed(2)}, Actual: $${order.refundAmount.toFixed(2)}`
          );
        }
      }
    }

    // Check for data type consistency
    if (typeof order.amountAUD !== 'number') {
      errors.push(`Order ${order.orderNumber}: amountAUD should be number, got ${typeof order.amountAUD}`);
    }

    if (order.fulfillmentCost && typeof order.fulfillmentCost !== 'number') {
      errors.push(`Order ${order.orderNumber}: fulfillmentCost should be number, got ${typeof order.fulfillmentCost}`);
    }
  });

  const isValid = errors.length === 0;
  const summary = `Validation complete: ${orders.length} orders checked, ${errors.length} errors, ${warnings.length} warnings`;

  return {
    isValid,
    warnings,
    errors,
    summary
  };
};

/**
 * Compare calculated stats with manual calculation to find discrepancies
 */
export const validateStatCalculations = (
  orders: EmailOrder[], 
  calculatedStats: MonthlyFinancialStats
): { isValid: boolean; discrepancies: DiscrepancyReport[]; summary: string } => {
  
  // Manual calculation for comparison
  const validOrders = orders.filter(order => 
    order.status !== 'refunded' && order.amountAUD && order.amountAUD > 0
  );

  let manualGrossRevenue = 0;
  let manualEtsyFees = 0;
  let manualNetRevenue = 0;
  let manualCosts = 0;

  validOrders.forEach(order => {
    const breakdown = getOrderFinancialBreakdown(order);
    manualGrossRevenue += breakdown.grossRevenue;
    manualEtsyFees += breakdown.etsyFeeAmount;
    manualNetRevenue += breakdown.netRevenue;
    manualCosts += breakdown.fulfillmentCosts;
  });

  const manualProfit = manualNetRevenue - manualCosts;
  const manualProfitMargin = manualGrossRevenue > 0 ? (manualProfit / manualGrossRevenue) * 100 : 0;

  // Compare calculated vs manual
  const discrepancies: DiscrepancyReport[] = [];
  const tolerance = 0.01; // $0.01 tolerance for floating point differences

  const checks = [
    { field: 'grossRevenue', expected: manualGrossRevenue, actual: calculatedStats.grossRevenue },
    { field: 'totalEtsyFees', expected: manualEtsyFees, actual: calculatedStats.totalEtsyFees },
    { field: 'netRevenue', expected: manualNetRevenue, actual: calculatedStats.netRevenue },
    { field: 'totalCosts', expected: manualCosts, actual: calculatedStats.totalCosts },
    { field: 'totalProfit', expected: manualProfit, actual: calculatedStats.totalProfit },
    { field: 'profitMarginPercentage', expected: manualProfitMargin, actual: calculatedStats.profitMarginPercentage }
  ];

  checks.forEach(check => {
    const difference = Math.abs(check.expected - check.actual);
    const percentageDiff = check.expected !== 0 ? (difference / Math.abs(check.expected)) * 100 : 0;
    
    if (difference > tolerance) {
      discrepancies.push({
        field: check.field,
        expectedValue: check.expected,
        actualValue: check.actual,
        difference,
        percentageDiff
      });
    }
  });

  const isValid = discrepancies.length === 0;
  const summary = `Stats validation: ${isValid ? 'PASSED' : 'FAILED'} - ${discrepancies.length} discrepancies found`;

  return {
    isValid,
    discrepancies,
    summary
  };
};

/**
 * Validate individual order financial calculations
 */
export const validateOrderFinancials = (order: EmailOrder): ValidationResult => {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!order.amountAUD || order.amountAUD <= 0) {
    errors.push('Invalid or missing gross revenue amount');
    return {
      isValid: false,
      warnings,
      errors,
      summary: 'Order validation failed: Invalid revenue data'
    };
  }

  // Check Etsy fee calculation
  const expectedEtsyFeePercentage = 11.5;
  const expectedEtsyFee = (order.amountAUD * expectedEtsyFeePercentage) / 100;
  
  if (order.etsyFeeAmount) {
    const feeDiff = Math.abs(expectedEtsyFee - order.etsyFeeAmount);
    if (feeDiff > 0.01) {
      warnings.push(`Etsy fee calculation may be incorrect: Expected $${expectedEtsyFee.toFixed(2)}, got $${order.etsyFeeAmount.toFixed(2)}`);
    }
  } else {
    warnings.push('Missing Etsy fee calculation');
  }

  // Check net revenue calculation
  const expectedNetRevenue = order.amountAUD - (order.etsyFeeAmount || expectedEtsyFee);
  if (order.netRevenue) {
    const netDiff = Math.abs(expectedNetRevenue - order.netRevenue);
    if (netDiff > 0.01) {
      warnings.push(`Net revenue calculation may be incorrect: Expected $${expectedNetRevenue.toFixed(2)}, got $${order.netRevenue.toFixed(2)}`);
    }
  } else {
    warnings.push('Missing net revenue calculation');
  }

  // Check profit calculation if costs are present
  if (order.fulfillmentCost !== undefined) {
    const expectedProfit = expectedNetRevenue - order.fulfillmentCost;
    const profitMargin = order.amountAUD > 0 ? (expectedProfit / order.amountAUD) * 100 : 0;
    
    if (profitMargin < 0) {
      warnings.push(`Order is unprofitable: Profit margin ${profitMargin.toFixed(1)}%`);
    } else if (profitMargin < 10) {
      warnings.push(`Low profit margin: ${profitMargin.toFixed(1)}%`);
    }
  }

  const isValid = errors.length === 0;
  const summary = `Order ${order.orderNumber} validation: ${isValid ? 'PASSED' : 'FAILED'} - ${errors.length} errors, ${warnings.length} warnings`;

  return {
    isValid,
    warnings,
    errors,
    summary
  };
};

/**
 * Generate a comprehensive financial health report
 */
export const generateFinancialHealthReport = (orders: EmailOrder[]): {
  overallHealth: 'excellent' | 'good' | 'warning' | 'critical';
  validation: ValidationResult;
  recommendations: string[];
  metrics: {
    dataCompleteness: number;
    calculationAccuracy: number;
    profitabilityScore: number;
  };
} => {
  
  const validation = validateFinancialConsistency(orders);
  const recommendations: string[] = [];
  
  // Calculate data completeness
  const totalOrders = orders.length;
  const ordersWithCompleteData = orders.filter(order => 
    order.amountAUD && 
    order.etsyFeeAmount && 
    order.netRevenue &&
    order.fulfillmentCost !== undefined
  ).length;
  
  const dataCompleteness = totalOrders > 0 ? (ordersWithCompleteData / totalOrders) * 100 : 0;
  
  // Calculate accuracy (based on validation warnings)
  const calculationAccuracy = Math.max(0, 100 - (validation.warnings.length * 5));
  
  // Calculate profitability score
  const stats = calculateMonthlyFinancialStats(orders);
  const profitabilityScore = Math.max(0, Math.min(100, 
    (stats.profitMarginPercentage + 20) * 2.5 // Scale 0-30% margin to 50-100 score
  ));

  // Generate recommendations
  if (dataCompleteness < 80) {
    recommendations.push('Improve data completeness - ensure all orders have complete financial data');
  }
  
  if (calculationAccuracy < 90) {
    recommendations.push('Review calculation logic - several validation warnings detected');
  }
  
  if (stats.profitMarginPercentage < 10) {
    recommendations.push('Consider optimizing costs or pricing to improve profit margins');
  }
  
  if (stats.totalEtsyFees / stats.grossRevenue > 0.15) {
    recommendations.push('Monitor Etsy fee percentage - may be higher than expected 11.5%');
  }

  // Determine overall health
  const avgScore = (dataCompleteness + calculationAccuracy + profitabilityScore) / 3;
  let overallHealth: 'excellent' | 'good' | 'warning' | 'critical';
  
  if (avgScore >= 90) overallHealth = 'excellent';
  else if (avgScore >= 75) overallHealth = 'good';
  else if (avgScore >= 50) overallHealth = 'warning';
  else overallHealth = 'critical';

  return {
    overallHealth,
    validation,
    recommendations,
    metrics: {
      dataCompleteness,
      calculationAccuracy,
      profitabilityScore
    }
  };
}; 