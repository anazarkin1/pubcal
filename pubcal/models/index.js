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

    static findAllUsers() {
        let database = null;
        connectToDB()
        .then((db) => {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            return users.find();
        })
        .then((result) => {
            console.log(result);
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })
    }

    static lookupUser(req,res, next) {
        let database = null;
        connectToDB()
        .then((db) => {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            return users.findOne({'email': req.session.user.email});
        })
        .then((result) => {
            console.log('result from lookupUser');
            console.log(result);
            if (result) {
                // TODO: nathan -> eddie: WHY ASSIGN RESULT TO MULTIPLE VARIABLES
                req.user = result;
                delete req.user.password;
                req.session.user = result;
                res.locals.user = result;
            }
            next();
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })
    }

    // returns number of document that matches provided email & password.
    static matchUserPassword(email, password, req, res){
        let database = null;
        connectToDB()
        .then((db)=> {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            return users.findOne({$and:[{'email': email}, {'password': password}]});
        })
        .then((result) => {
            if (result){
                req.session.user = result;
                res.render('profile_sample', {
                    email: req.session.user.email
                });
            } else {
                res.redirect('/');
            }
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })
    }

    static addUser(email, username, password, req, res) {
        let database = null;
        let usrRegex = new RegExp('^[a-zA-Z0-9äöüÄÖÜ]*$');
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        connectToDB()
            .then((db)=> {
                database = db;
                return db.collection('users');
            })
            .then((users) => {
                return users.findOne({'username': username})
            .then((result) => {
                    console.log('the result is: ' + JSON.stringify(result));
                if (result) {
                    res.render('index_sample', {
                        errors: 'username already in use'
                    });
                } else {
                    users.findOne({'email': email})
                        .then((result)=>{
                        console.log('the result is: ' + JSON.stringify(result));
                        if (result) {
                            console.log('the result is: ' + JSON.stringify(result));
                            res.render('index_sample', {
                                errors: 'email already in use'
                            });
                        } else {
                             if (!usrRegex.test(username)) {
                                res.render('index_sampe', {
                                    errors: 'username invalid format'
                                });
                            } else if (!emailRegex.test(email)) {
                                res.render('index_sample', {
                                    errors: 'email invalid format'
                                });
                            } else {
                                let newUser = {
                                    username: username,
                                    password: password,
                                    email: email,
                                    subscribed_to: []
                                };

                                // adding new user to the database
                                users.insert(newUser)
                                    .then((result) =>{
                                        req.user = result;
                                        delete req.user.password;
                                        req.session.user = result;
                                        res.locals.user = result;

                                        res.render('profile_sample', {
                                            email: req.session.user.email
                                        });
                                        database.close();
                                })
                            }
                        }
                    })
                }
            })
        })
        .catch((err) => {
            console.error(err);
        })
    }

    static searchForCalendars(tag, res) {
        let database = null;
        connectToDB()
            .then((db) => {
                database = db;
                return db.collection('calendars');
            })
            .then((calendars) => {
                // find calendars where tags contain tag
                return calendars.find({'tags': tag});
            })
            .then((result) => {
                if (!result.length) { // not found
                    res.render('index_sample', {
                        errors: 'calendar not found'
                    });
                } else {
                    res.redirect('calendar_result_sample');
                }
                database.close();
            })
            .catch((err) => {
                console.error(err);
            })
    }
}

module.exports = DBClient;
