
const admin = require('firebase-admin');
const serviceAccount = require('./etsy-dropship-manager-d6584112d0db.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://etsy-dropship-manager-d6584112d0db.firebaseio.com'
});

const db = admin.firestore();

async function checkFulfilledOrders() {
  console.log('Checking fulfilled orders...');
  
  const snapshot = await db.collection('email_orders').where('status', '==', 'fulfilled').get();
  
  console.log('Found', snapshot.size, 'fulfilled orders');
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log('Order:', data.orderNumber, 'Status:', data.status);
    if (data.updatedAt) {
      console.log('Updated at:', data.updatedAt.toDate());
    } else {
      console.log('No updatedAt field');
    }
  });
}

checkFulfilledOrders().catch(console.error);

