const mongoClient = require('mongodb').MongoClient;

const connectToDB = () => {
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
};

class DBClient {
    static addUser(object) {
        let database = null;
        connectToDB()
        .then((db) => {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            return users.insert(object);
        })
        .then((result) => {
            console.log(result);
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })
    }

    static updateUser(filter, update) {
        let database = null;
        connectToDB()
        .then((db) => {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            return users.updateOne(filter, update);
        })
        .then((result) => {
            console.log(result);
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })
    }

    static findAllUsers() {
        let database = null;
        connectToDB()
        .then((db) => {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            return users.find();
        })
        .then((result) => {
            console.log(result);
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })
    }
}

module.exports = DBClient;