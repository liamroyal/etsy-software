import React, { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import styles from './TrackingDatabase.module.css';

interface TrackingEntry {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  dateAdded: string;
  status: string;
}

export const TrackingDatabase: React.FC = () => {
  const [trackingEntries, setTrackingEntries] = useState<TrackingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingEntries = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef);
        const querySnapshot = await getDocs(q);
        
        const entries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TrackingEntry[];

        setTrackingEntries(entries);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tracking entries:', err);
        setError('Failed to load tracking entries');
        setLoading(false);
      }
    };

    fetchTrackingEntries();
  }, []);

  if (loading) {
    return <div>Loading tracking database...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Tracking Database</h1>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Tracking Number</th>
              <th>Carrier</th>
              <th>Date Added</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {trackingEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.orderNumber}</td>
                <td>{entry.trackingNumber}</td>
                <td>{entry.carrier}</td>
                <td>{entry.dateAdded}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 