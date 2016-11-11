const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
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

    static findUserByEmail(email, req, res) {
        let database = null;
        var found = false;
        return connectToDB()
            .then((db) => {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.findOne({'email': email});
            })
            .then((result) => {
                if (result) {
                    // TODO: nathan -> eddie: WHY ASSIGN RESULT TO MULTIPLE VARIABLES
                    // req.user is the important one, it keeps track of the session user.
                    // req.session.user pulls information from cookie which is subject to changes.
                    req.user = result;
                    delete req.user.password;
                    req.session.user = result;
                    res.locals.user = result;
                    found = true;
                }
                database.close();
                return found;
            });
    }

    // returns number of document that matches provided email & password.
    static login(email, password) {
        let database = null;
        return connectToDB()
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

    static addUser(email, username, password, req, res) {
        let database = null;
        connectToDB()
        .then((db)=> {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            return users.insert({
                username: username,
                password: password,
                email: email,
                subscribed_to: []
            });
        })
        .then((result) => {
            req.user = result;
            delete req.user.password;
            req.session.user = result;
            res.locals.user = result;

            res.render('profile_sample', {
                email: req.session.user.email
            });
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })
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
        })
    }
}

module.exports = DBClient;
