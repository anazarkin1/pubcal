const BaseClient = require('./base');
const ObjectID = require('mongodb').ObjectID;
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
            .then((db) => {
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
            .then((db) => {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.findOne({'email': email});
            })
            .then((result) => {
                return result.subscribed_to;
            })
            .then((ids) => {
                return database.collection('calendars').find({_id: {$in: ids}}).toArray();
            })
            .then((result2) => {
                database.close();
                return result2;
            });
    }

    static subscribe(username, id) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.update(
                    {username: username},
                    {$push: {subscribed_to: ObjectID(id)}});
            })
            .then((result) => {
                database.close();
                return result;
            });
    }

    static unSubscribe(username, id) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.update(
                    {username: username},
                    {$pull: {subscribed_to: ObjectID(id)}});
            })
            .then((result) => {
                database.close();
                return result;
            });
    }

    static isSubscribed(username, calID) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('users').findOne({username: username});
            })
            .then((user) => {
                let isSubed = false;
                if (!Object.keys(user).includes("subscribed_to")) {
                    return false;
                }
                for (let id of user.subscribed_to) {
                    if (id.toString() === calID) {
                        isSubed = true;
                        break;
                    }
                }
                return isSubed;
            })
    }

    static getTopFiveUsers() {
        let database = null;
        BaseClient.connectToDB(callback)
            .then((db) => {
                database = db;
                return db.collection('users');
            }).then((calendars) => {
            return calendars.aggregate(
                {$project: {calendarSize: {$size: 'subscribed_to'}}},
                {$sort: {calendarSize: -1}},
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

    static getPendingNotification(username){
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('users').findOne({username: username});
            })
            .then((user)=> {
                return user.pending_notification;
            })
            .then((result) => {
                database.close();
                return result;
            })
            .catch((err) => {
                console.error(err);
            });
        
    }
    static clearNotification(username){
        let database = null;
        console.log('this is clearNotification, '+ username);
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.update(
                    {username: username},
                    {$set: {pending_notification: []}});
            })
            .then((result) => {
                database.close();
                return result;
            });
    }
}

module.exports = UserClient;