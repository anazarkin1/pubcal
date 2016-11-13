const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
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
    //size of the pagination page
    static get pageSize() {
        return 10;
    }

    //Used for testing
    static getRandomCalendar() {
        return connectToDB()
            .then((db)=> {
                return db.collection('calendars');
            })
            .then((calendars)=> {
                return calendars.findOne();
            })
            .then((result)=> {
                return result;
            });
    }

    static addCalendar(calendar) {
        return connectToDB()
            .then((db) => {
                return db.collection('calendars');
            })
            .then((calendars) => {
                return calendars.insertOne(calendar);
            })
            .then((result) => {
                return result;
            });
    }

    static searchForCalendars(query, skip = 0, callback) {
        let database = null;
        let filter = {$text: {$search: query, $caseSensitive: false}};
        connectToDB()
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
        let filter = {"_id": ObjectId(id)};
        return connectToDB()
            .then((db) => {
                return db.collection('calendars');
            })
            .then((calendars) => {
                return calendars.replaceOne(filter, newCalendar);
            })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    static updateCalendar(filter, update) {
        return connectToDB()
            .then((db) => {
                return db.collection('calendars');
            })
            .then((calendars) => {
                return calendars.updateOne(filter, update);
            })
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    static removeCalendarById(id) {
        let filter = {"_id": ObjectId(id)};
        return connectToDB()
            .then((db) => {
                return db.collection('calendars');
            })
            .then((calendars) => {
                //remove is Deprecated, see https://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#remove
                return calendars.deleteOne(filter);
            })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    static getCalendarById(id) {
        return connectToDB()
            .then((db)=> {
                return db.collection('calendars');
            }).then((calendars)=> {
                return calendars.findOne({"_id": ObjectId(id)});
            })
            .then((result)=> {
                return result;
            })
            .catch((err)=> {
                console.log(err);
            });
    }
}

module.exports = CalendarClient;
