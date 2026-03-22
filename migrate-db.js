const mongoose = require('mongoose');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/coderise';
// Using the provided cloud URI, ensuring the database name 'coderise' is specified before the query string
const REMOTE_URI = 'mongodb+srv://CodeRise:CodeRise_Tech@cluster0.htuyiib.mongodb.net/coderise?appName=Cluster0';

async function migrate() {
  try {
    console.log('Connecting to local DB...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('Connected to local DB successfully.');
    
    console.log('Connecting to remote Cloud DB...');
    const remoteConn = await mongoose.createConnection(REMOTE_URI).asPromise();
    console.log('Connected to remote Cloud DB successfully.');
    
    const collections = await localConn.db.listCollections().toArray();
    
    for (let col of collections) {
      const colName = col.name;
      console.log(`\n--- Processing collection: ${colName} ---`);
      
      const docs = await localConn.db.collection(colName).find({}).toArray();
      console.log(`Found ${docs.length} documents in local '${colName}'.`);
      
      if (docs.length > 0) {
        // Clear the remote collection to avoid duplicates during migration
        console.log(`Clearing existing documents in remote '${colName}'...`);
        await remoteConn.db.collection(colName).deleteMany({});
        
        // Insert all documents
        console.log(`Inserting ${docs.length} documents to remote '${colName}'...`);
        await remoteConn.db.collection(colName).insertMany(docs);
        console.log(`Done migrating '${colName}'.`);
      } else {
        console.log(`Skipping '${colName}' as it is empty.`);
      }
    }
    
    console.log('\n✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed with error:', error);
    process.exit(1);
  }
}

migrate();
