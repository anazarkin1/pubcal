const BaseClient = require('./base');

class UserClient {
    static updateUser(filter, update) {
        let database = null;
        return BaseClient.connectToDB()
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
            });
    }

    static addUser(user) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db)=> {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.insert(user);
            })
            .then((result) => {
                database.close();
                return result;
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

module.exports = UserClient;