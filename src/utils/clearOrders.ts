import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

// Function to clear all email orders
const clearAllOrders = async () => {
  try {
    console.log('🗑️ Starting to clear all email orders...');
    
    const ordersRef = collection(db, 'email_orders');
    const snapshot = await getDocs(ordersRef);
    
    console.log(`📊 Found ${snapshot.docs.length} orders to delete`);
    
    if (snapshot.docs.length === 0) {
      console.log('📭 No orders found to delete');
      return { success: true, deletedCount: 0 };
    }
    
    const deletePromises = snapshot.docs.map(orderDoc => 
      deleteDoc(doc(db, 'email_orders', orderDoc.id))
    );
    
    await Promise.all(deletePromises);
    
    console.log('✅ Successfully cleared all email orders!');
    console.log('🔄 Refresh the page to see empty state');
    
    return { success: true, deletedCount: snapshot.docs.length };
  } catch (error) {
    console.error('❌ Error clearing orders:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Make it globally available
declare global {
  interface Window {
    clearAllOrders: typeof clearAllOrders;
  }
}

window.clearAllOrders = clearAllOrders;

export default clearAllOrders; 