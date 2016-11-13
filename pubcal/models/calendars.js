const BaseClient = require('./base');

class CalendarClient {
    //Used for testing
    static getRandomCalendar() {
        let database = null;
        return BaseClient.connectToDB()
            .then((db)=> {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars)=> {
                return calendars.findOne();
            })
            .then((result)=> {
                database.close();
                return result;
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

    static searchForCalendars(tag, callback) {
        let database = null;
        BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars) => {
                return calendars.find({tags: tag});
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
        let filter = {"_id": ObjectId(id)};
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

    static updateCalendar(filter, update) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars) => {
                return calendars.updateOne(filter, update);
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
        let filter = {"_id": ObjectId(id)};
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars) => {
                //remove is Deprecated, see https://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#remove
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
            .then((db)=> {
                database = db;
                return db.collection('calendars');
            }).then((calendars)=> {
                return calendars.findOne({"_id": ObjectId(id)});
            })
            .then((result)=> {
                database.close();
                return result;
            })
            .catch((err)=> {
                console.log(err);
            });
    }
}

module.exports = CalendarClient;
