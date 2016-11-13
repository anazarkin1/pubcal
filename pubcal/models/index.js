const BaseClient = require('./base');

class IndexClient {
    static findUserByEmail(email) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.findOne({'email': email});
            })
            .then((result) => {
                database.close();
                return result;
            });
    }

    // returns number of document that matches provided email & password.
    static login(email, password) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.findOne({$and:[{email: email}, {password: password}]});
            })
            .then((result) => {
                database.close();
                return result;
            })
            .catch((err) => {
                console.error(err);
            })
    }
}

module.exports = IndexClient;
