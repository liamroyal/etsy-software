
// Quick debug script to mark some orders as fulfilled
console.log('=== DEBUGGING FULFILLED ORDERS ===');

// Check if there are any fulfilled orders in localStorage or check the database
const checkFulfilledOrders = () => {
  console.log('🔍 Checking for fulfilled orders...');
  
  // You can run this in browser console to check orders
  console.log('Open browser console and run:');
  console.log('// Check if any orders have status fulfilled');
  console.log('console.log("Orders in state:", window.allOrders);');
};

checkFulfilledOrders();

