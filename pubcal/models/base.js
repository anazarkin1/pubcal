const mongoClient = require('mongodb').MongoClient;

class BaseClient {
    static connectToDB() {
        // let url = 'mongodb://localhost:27017';
        let url = process.env.MONGO_URL;
        return new Promise((resolve, reject) => {
            mongoClient.connect(url, (err, db) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(db);
                }
            });
        });
    }
}

module.exports = BaseClient;
