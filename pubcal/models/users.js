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

    static getCalendars(email) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db)=> {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                console.log("hehe"+email);
                return users.findOne({'email': email});
            })
            .then((result) => {
                database.close();
                return result.subscribed_to;
            });
    }

    static subscribe(username, id) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db)=> {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.update(
                    {username: username},
                    {$push: {subscribed_to: id}});
            })
            .then((result) => {
                database.close();
                return result;
            });
    }

    static unSubscribe(username, id) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db)=> {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.update(
                    {username: username},
                    {$pull: {subscribed_to: id}});
            })
            .then((result) => {
                database.close();
                return result;
            });
    }

    static getTopFiveUsers() {
        let database = null;
        BaseClient.connectToDB(callback)
            .then((db) => {
                database = db;
                return db.collection('users');
            }).then((calendars) => {
                return calendars.aggregate(
                    {$project: {calendarSize: {$size:'subscribed_to'}}},
                    {$sort: {calendarSize:-1}},
                    {$limit: 5});
            })
            .then((result) => {
                result.toArray((err, documents) => {
                    callback(documents);
                    database.close();
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

module.exports = UserClient;