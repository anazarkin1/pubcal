// Modified mongo documentation
// http://mongodb.github.io/node-mongodb-native/2.2/quick-start/

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/mongo_ex';

// Use connect method to connect to the server
MongoClient.connect(url, (err, db) => {
    console.log("Connected successfully to server");

    insertDocuments(db, () => {
        updateDocument(db, () => {
            removeDocument(db, () => {
                db.close();
            });
        });
    });
});

const insertDocuments = (db, callback) => {
    // Get the documents collection
    let collection = db.collection('documents');

    // Insert some documents
    collection.insertMany([
        {a : 1}, 
        {a : 2}, 
        {a : 3}
    ], (err, result) => {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
};

const findDocuments = (db, callback) => {
    // Get the documents collection
    let collection = db.collection('documents');
    // Find some documents
    collection.find({'a': 3}).toArray((err, docs) => {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });      
};

const updateDocument = (db, callback) => {
    // Get the documents collection
    let collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ a : 2 }
        , { $set: { b : 1 } }, (err, result) => {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
    });  
};

const removeDocument = (db, callback) => {
    // Get the documents collection
    let collection = db.collection('documents');
    // Insert some documents
    collection.deleteOne({ a : 3 }, (err, result) => {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });    
};
