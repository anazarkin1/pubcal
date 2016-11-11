const BaseClient = require('./base');

class CalendarClient {
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
                console.log(result);
                database.close();
            })
            .catch((err) => {
                console.error(err);
            });
    }

    static removeCalendar(filter) {
        let database = null;
        return BaseClient.connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars) => {
                return calendars.remove(filter);
            })
            .then((result) => {
                console.log(result);
                database.close();
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

module.exports = CalendarClient;
