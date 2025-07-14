import { EmailOrder } from './emailOrderService';

// Constants for financial calculations
export const ETSY_FEE_PERCENTAGE = 11.5; // Etsy's commission percentage

// Interface for financial breakdown
export interface FinancialBreakdown {
  grossRevenue: number;
  etsyFeePercentage: number;
  etsyFeeAmount: number;
  netRevenue: number;
  fulfillmentCosts: number;
  profit: number;
  profitMarginPercentage: number;
}

// Interface for monthly financial stats
export interface MonthlyFinancialStats {
  totalOrders: number;
  grossRevenue: number;
  totalEtsyFees: number;
  netRevenue: number;
  totalCosts: number;
  totalProfit: number;
  averageCostPerOrder: number;
  averageProfitPerOrder: number;
  profitMarginPercentage: number;
}

/**
 * Calculate Etsy fee for a given amount
 */
export const calculateEtsyFee = (grossAmount: number, feePercentage: number = ETSY_FEE_PERCENTAGE): number => {
  return (grossAmount * feePercentage) / 100;
};

/**
 * Calculate net revenue after Etsy fees
 */
export const calculateNetRevenue = (grossAmount: number, etsyFeeAmount: number): number => {
  return grossAmount - etsyFeeAmount;
};

/**
 * Calculate profit (net revenue - costs)
 */
export const calculateProfit = (netRevenue: number, costs: number): number => {
  return netRevenue - costs;
};

/**
 * Calculate profit margin percentage
 */
export const calculateProfitMarginPercentage = (profit: number, grossRevenue: number): number => {
  return grossRevenue > 0 ? (profit / grossRevenue) * 100 : 0;
};

/**
 * Get standardized financial breakdown for a single order
 */
export const getOrderFinancialBreakdown = (order: EmailOrder): FinancialBreakdown => {
  const grossRevenue = order.amountAUD || 0;
  const etsyFeePercentage = order.etsyFeePercentage || ETSY_FEE_PERCENTAGE;
  const etsyFeeAmount = order.etsyFeeAmount || calculateEtsyFee(grossRevenue, etsyFeePercentage);
  const netRevenue = order.netRevenue || calculateNetRevenue(grossRevenue, etsyFeeAmount);
  const fulfillmentCosts = order.fulfillmentCost || 0;
  const profit = calculateProfit(netRevenue, fulfillmentCosts);
  const profitMarginPercentage = calculateProfitMarginPercentage(profit, grossRevenue);

  return {
    grossRevenue,
    etsyFeePercentage,
    etsyFeeAmount,
    netRevenue,
    fulfillmentCosts,
    profit,
    profitMarginPercentage
  };
};

/**
 * Calculate monthly financial stats for a collection of orders
 */
export const calculateMonthlyFinancialStats = (orders: EmailOrder[]): MonthlyFinancialStats => {
  const validOrders = orders.filter(order => 
    // Exclude refunded orders from financial calculations
    order.status !== 'refunded' && 
    // Only include orders with valid amount data
    order.amountAUD && order.amountAUD > 0
  );

  const totalOrders = validOrders.length;
  
  if (totalOrders === 0) {
    return {
      totalOrders: 0,
      grossRevenue: 0,
      totalEtsyFees: 0,
      netRevenue: 0,
      totalCosts: 0,
      totalProfit: 0,
      averageCostPerOrder: 0,
      averageProfitPerOrder: 0,
      profitMarginPercentage: 0
    };
  }

  let grossRevenue = 0;
  let totalEtsyFees = 0;
  let netRevenue = 0;
  let totalCosts = 0;

  validOrders.forEach(order => {
    const breakdown = getOrderFinancialBreakdown(order);
    grossRevenue += breakdown.grossRevenue;
    totalEtsyFees += breakdown.etsyFeeAmount;
    netRevenue += breakdown.netRevenue;
    totalCosts += breakdown.fulfillmentCosts;
  });

  const totalProfit = calculateProfit(netRevenue, totalCosts);
  const averageCostPerOrder = totalCosts / totalOrders;
  const averageProfitPerOrder = totalProfit / totalOrders;
  const profitMarginPercentage = calculateProfitMarginPercentage(totalProfit, grossRevenue);

  return {
    totalOrders,
    grossRevenue,
    totalEtsyFees,
    netRevenue,
    totalCosts,
    totalProfit,
    averageCostPerOrder,
    averageProfitPerOrder,
    profitMarginPercentage
  };
};

/**
 * Handle refund financial calculations
 * Returns adjusted amounts for refunded orders
 */
export const calculateRefundAdjustments = (
  originalAmount: number, 
  refundPercentage: number, 
  customerReturningItems: boolean,
  originalEtsyFee: number = 0,
  originalCost: number = 0
): {
  adjustedRevenue: number;
  adjustedEtsyFee: number;
  adjustedCost: number;
  adjustedProfit: number;
} => {
  const refundAmount = (originalAmount * refundPercentage) / 100;
  
  // Calculate adjusted amounts based on refund scenario
  const adjustedRevenue = customerReturningItems ? 0 : originalAmount - refundAmount;
  const adjustedEtsyFee = customerReturningItems ? 0 : originalEtsyFee - ((originalEtsyFee * refundPercentage) / 100);
  const adjustedCost = customerReturningItems ? 0 : originalCost;
  const adjustedNetRevenue = adjustedRevenue - adjustedEtsyFee;
  const adjustedProfit = adjustedNetRevenue - adjustedCost;

  return {
    adjustedRevenue,
    adjustedEtsyFee,
    adjustedCost,
    adjustedProfit
  };
};

/**
 * Update order with calculated Etsy fee fields
 * This should be called when processing new orders
 */
export const calculateOrderFinancialFields = (order: Partial<EmailOrder>): Partial<EmailOrder> => {
  if (!order.amountAUD || order.amountAUD <= 0) {
    return order;
  }

  const etsyFeePercentage = order.etsyFeePercentage || ETSY_FEE_PERCENTAGE;
  const etsyFeeAmount = calculateEtsyFee(order.amountAUD, etsyFeePercentage);
  const netRevenue = calculateNetRevenue(order.amountAUD, etsyFeeAmount);

  return {
    ...order,
    etsyFeePercentage,
    etsyFeeAmount,
    netRevenue
  };
};

/**
 * Format currency with proper symbols and decimals
 */
export const formatFinancialAmount = (amount: number, currency: string = 'AUD'): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format percentage with proper decimals
 */
export const formatPercentage = (percentage: number, decimals: number = 1): string => {
  return `${percentage.toFixed(decimals)}%`;
}; 