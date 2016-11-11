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

class CalendarClient {
    static addCalendar(calendar) {
        let database = null;
        return connectToDB()
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
        connectToDB()
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
        return connectToDB()
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
        return connectToDB()
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
