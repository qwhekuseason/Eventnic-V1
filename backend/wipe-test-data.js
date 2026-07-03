const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// This script clears out ALL events, users, tickets, and votes from the database.
// USE WITH EXTREME CAUTION. Only use before launching to production to clear test data.

const serviceAccount = require('./eventnic-93f29-firebase-adminsdk-fbsvc-685ab0fd4c.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function deleteCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__');
  
  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

async function wipeAll() {
  console.log('Starting data wipe...');

  // Delete Firestore Collections
  const collections = ['events', 'users', 'tickets', 'votes', 'nominations'];
  for (const col of collections) {
    console.log(`Deleting collection: ${col}`);
    await deleteCollection(col);
  }

  console.log('Firestore data cleared.');

  // Delete Authentication Users
  console.log('Fetching auth users...');
  let nextPageToken;
  do {
    const listUsersResult = await getAuth().listUsers(1000, nextPageToken);
    const uids = listUsersResult.users.map(user => user.uid);
    if (uids.length > 0) {
       console.log(`Deleting ${uids.length} auth users...`);
       await getAuth().deleteUsers(uids);
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);

  console.log('Auth users cleared.');
  console.log('✅ All test data wiped successfully.');
  process.exit(0);
}

wipeAll().catch(console.error);
