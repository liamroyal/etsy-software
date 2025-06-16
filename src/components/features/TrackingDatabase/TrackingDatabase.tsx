import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { PermissionGate } from '../../common/AccessControl/PermissionGate';
import styles from './TrackingDatabase.module.css';

interface TrackingOrder {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  dateAdded: Date;
  fulfilled: boolean;
}

const TrackingLink: React.FC<{ trackingNumber: string }> = ({ trackingNumber }) => (
  <a 
    href={`https://parcelsapp.com/en/tracking/${trackingNumber}`}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.trackingLink}
  >
    {trackingNumber}
  </a>
);

const ActionButtons: React.FC<{
  trackingNumber: string;
  orderId: string;
  isDeleting: boolean;
  onDelete: () => void;
}> = ({ trackingNumber, orderId, isDeleting, onDelete }) => (
  <div className={styles.actionsCell}>
    <button 
      className={styles.trackButton}
      onClick={() => window.open(`https://parcelsapp.com/en/tracking/${trackingNumber}`, '_blank')}
    >
      Track 🔍
    </button>
    <PermissionGate adminOnly>
      <button 
        className={styles.deleteButton}
        onClick={onDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : '🗑️ Delete'}
      </button>
    </PermissionGate>
  </div>
);

export const TrackingDatabase: React.FC = () => {
  const [orders, setOrders] = useState<TrackingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('dateAdded', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateAdded: doc.data().dateAdded?.toDate() || new Date(),
          fulfilled: doc.data().fulfilled || false
        })) as TrackingOrder[];

        setOrders(fetchedOrders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load tracking numbers');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleFulfillmentChange = async (orderId: string, currentFulfilled: boolean) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        fulfilled: !currentFulfilled
      });

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, fulfilled: !currentFulfilled }
            : order
        )
      );
    } catch (err) {
      console.error('Error updating order fulfillment:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        Loading tracking numbers...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        No tracking numbers found.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tracking Database</h1>
        <p className={styles.subtitle}>
          View and manage all tracking numbers
        </p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Order Number</th>
              <th className={styles.tableHeaderCell}>Tracking Number</th>
              <th className={styles.tableHeaderCell}>Date Added</th>
              <th className={styles.tableHeaderCell}>Fulfilled</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  {order.orderNumber}
                </td>
                <td className={styles.tableCell}>
                  <TrackingLink trackingNumber={order.trackingNumber} />
                </td>
                <td className={styles.tableCell}>
                  {order.dateAdded.toLocaleDateString()}
                </td>
                <td className={styles.tableCell}>
                  <input
                    type="checkbox"
                    checked={order.fulfilled}
                    onChange={() => handleFulfillmentChange(order.id, order.fulfilled)}
                    className={styles.checkbox}
                  />
                  {order.fulfilled && <span className={styles.checkmark}>✓</span>}
                </td>
                <td className={styles.tableCell}>
                  <ActionButtons
                    trackingNumber={order.trackingNumber}
                    orderId={order.id}
                    isDeleting={isDeleting === order.id}
                    onDelete={() => handleDeleteOrder(order.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 