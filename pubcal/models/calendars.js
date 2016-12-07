const BaseClient = require('./base');
const ObjectID = require('mongodb').ObjectID;

class CalendarClient {
    //size of the pagination page
    static get pageSize() {
        return 10;
    }

    //Used for testing
    static getRandomCalendar() {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars) => {
                return calendars.findOne();
            })
            .then((result) => {
                database.close();
                return result;
            });
    }

    static getSubscribers(calID) {
        let database = null;
        let filter = {"_id": ObjectID(calID)};
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars').aggregate([
                    {"$match": {"_id": ObjectID(calID)}},
                    {"$unwind": "$users_subscribed"},
                    {
                        "$lookup": {
                            from: "users",
                            localField: "users_subscribed",
                            foreignField: "username",
                            as: "user_info"
                        }
                    },
                    {
                        "$match": {"user_info": {"$ne": []}}
                    },
                    {
                        "$project": {
                            "_id": 1,
                            "name": 1,
                            "created_by": 1,
                            "user_info": 1
                        }
                    }
                ]);
            })
            .then((info) => {
                return info.toArray();
            })
            .then((arr) => {
                let subscribers = [];
                for (let el of arr) {
                    subscribers.push(el.user_info[0]);
                }
                return subscribers;
            });
    }

    static addCalendar(calendar) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars) => {
                return calendars.insertOne(calendar);
            })
            .then((result) => {
                database.close();
                return result;
            });
    }

    static searchForCalendars(query, skip = 0, callback) {
        let database = null;
        let filter = {$text: {$search: query, $caseSensitive: false}};
        BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars) => {
                //TODO: very basic pagination, want to rewrite this in the future to
                //paginate using id's of previously returned resutls
                //see https://scalegrid.io/blog/fast-paging-with-mongodb/
                return calendars.find(filter).skip(skip).limit(this.pageSize);
            })
            .then((result) => {
                result.toArray((err, documents) => {
                    callback(documents);
                    database.close();
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    static replaceCalendar(id, newCalendar) {
        let database = null;
        let filter = {"_id": ObjectID(id)};
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars) => {
                return calendars.replaceOne(filter, newCalendar);
            })
            .then((result) => {
                database.close();
                return result;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    static removeCalendarById(id) {
        let database = null;
        let filter = {"_id": ObjectID(id)};
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars) => {
                return calendars.deleteOne(filter);
            })
            .then((result) => {
                database.close();
                return result;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    static getCalendarById(id) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            }).then((calendars) => {
                return calendars.findOne({"_id": ObjectID(id)});
            })
            .then((result) => {
                database.close();
                return result;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static getCalendarsByIds(ids, callback) {
        let database = null;
        BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return database.collection('calendars');
            })
            .then((calendars) => {
                for (let i = 0; i < ids.length; i++) {
                    ids[i] = ObjectID(ids[i])
                }
                return calendars.find({'_id': {$in: ids}});
            })
            .then((result) => {
                result.toArray((err, documents) => {
                    callback(documents);
                    database.close();
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    static beSubscribed(id, username) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            }).then((calendars) => {
                return calendars.update(
                    {_id: ObjectID(id)},
                    {$push: {users_subscribed: username}});
            })
            .then((result) => {
                database.close();
                return result;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static beUnSubscribed(id, username) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            }).then((calendars) => {
                return calendars.update(
                    {_id: ObjectID(id)},
                    {$pull: {users_subscribed: username}});
            })
            .then((result) => {
                database.close();
                return result;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static getTopFiveCalendars(callback) {
        let database = null;
        BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            }).then((calendars) => {
            return calendars.aggregate(
                {$project: {userSize: {$size: '$users_subscribed'}}},
                {$sort: {userSize: -1}},
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

    static addUpdatedCalendarsToUser(username, calendar_name, mode){

        let database = null;
        return BaseClient.connectToDB()
                .then((db) => {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            return users.findOne({'username': username});
        })
        .then((result) => {
            result.pending_notification.push({ "calendar_id": calendar_name, "mode": mode });
            database.close();
            return result;
        });
    }
}

module.exports = CalendarClient;
