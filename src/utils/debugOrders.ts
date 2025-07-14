import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getOrderDate, EmailOrder } from '../services/emailOrderService';

// Function to debug what orders exist vs what's being shown
const debugOrders = async () => {
  try {
    console.log('🔍 Debugging orders in database...');
    
    const ordersRef = collection(db, 'email_orders');
    const snapshot = await getDocs(ordersRef);
    
    if (snapshot.docs.length === 0) {
      console.log('📭 No orders found in database');
      return;
    }
    
    console.log(`📊 Total orders in database: ${snapshot.docs.length}`);
    
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    let unfulfilledCount = 0;
    let fulfilledTodayCount = 0;
    let fulfilledOlderCount = 0;
    let refundCount = 0;
    
    snapshot.docs.forEach(doc => {
      const order = { id: doc.id, ...doc.data() } as EmailOrder;
      const orderDate = getOrderDate(order.receivedAt);
      
      console.log(`📋 Order ${order.orderNumber}:`, {
        status: order.status,
        type: order.type || 'ORDER',
        date: orderDate.toLocaleDateString(),
        age: Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)) + ' days',
        store: order.store,
        amount: order.amount
      });
      
      if (order.type === 'REFUND') {
        refundCount++;
      } else if (order.status !== 'fulfilled') {
        unfulfilledCount++;
      } else if (orderDate >= startOfToday) {
        fulfilledTodayCount++;
      } else {
        fulfilledOlderCount++;
      }
    });
    
    console.log('\n📈 SUMMARY:');
    console.log(`✅ Unfulfilled orders: ${unfulfilledCount} (WILL SHOW)`);
    console.log(`🟢 Fulfilled today: ${fulfilledTodayCount} (WILL SHOW)`);
    console.log(`🚫 Fulfilled older: ${fulfilledOlderCount} (HIDDEN BY FILTER)`);
    console.log(`↩️ Refunds: ${refundCount} (WILL SHOW if unfulfilled or today)`);
    
    if (fulfilledOlderCount > 0) {
      console.log('\n⚠️ WARNING: You have fulfilled orders from previous days that are being hidden!');
      console.log('💡 Consider modifying the date filter to show more orders.');
    }
    
  } catch (error) {
    console.error('❌ Error debugging orders:', error);
  }
};

// Function to show ALL orders (bypass filtering)
const showAllOrders = async () => {
  try {
    console.log('🔍 Fetching ALL orders (no filtering)...');
    
    const ordersRef = collection(db, 'email_orders');
    const snapshot = await getDocs(ordersRef);
    
    console.log(`📊 Total orders: ${snapshot.docs.length}`);
    
    snapshot.docs.forEach(doc => {
      const order = { id: doc.id, ...doc.data() } as EmailOrder;
      console.log(`📦 ${order.orderNumber} | ${order.store} | ${order.status === 'fulfilled' ? '✅' : '⏳'} | ${order.amount} ${order.originalCurrency}`);
    });
    
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
  }
};

// Make functions globally available
declare global {
  interface Window {
    debugOrders: typeof debugOrders;
    showAllOrders: typeof showAllOrders;
  }
}

window.debugOrders = debugOrders;
window.showAllOrders = showAllOrders;

export { debugOrders, showAllOrders }; 