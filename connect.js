const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(url);
const dbName = 'Radion';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('Radion');

  // CRUD Operation Code

  const insertResult = await collection.insertOne({ rollno: 6001, name: "Umang" });

  console.log('Inserted documents =>', insertResult);

  return 'done';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
