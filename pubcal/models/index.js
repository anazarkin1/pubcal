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

class DBClient {
    static addUser(object) {
        let database = null;
        connectToDB()
        .then((db) => {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            return users.insert(object);
        })
        .then((result) => {
            console.log(result);
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })
    }

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
    // returns number of document that matches provided email & password. 
    static matchUserPassword(email, password){
        let database = null;
        connectToDB()
        .then((db)=> {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            return users.find({$and:[{"email": email}, {"password": password}]});
        })
        .then((result) => {
            console.log(result);
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })
    }

    // checks availability of provided username.
    // - returns 0 if username is available to be used.
    // - returns 1 if username is already in use. 
    // - returns 2 if username is invalid (i.e. wrong format).
    static validateUsername(username){

        // TODO: add more restriction to the whitelist
        let usrRegex = new RegExp("^[a-zA-Z0-9äöüÄÖÜ]*$");
        let database = null;
        connectToDB()
        .then((db)=> {
            database = db;
            return db.collection('users');
        })
        .then((users) => {

            if (users.find({$and:[{"username": username}]}).count() == 1){ //username already in use

                return 1;

            } else {

                if (usrRegex.test(username)) { //username valid & available

                    return 0;

                } else { //username invalid

                    return 2;
                }

            }
            
            
        })
        .then((result) => {
            console.log(result);
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })

    }

    // returns number of document that returns provided email address.
    // - returns 0 if username is available to be used.
    // - returns 1 if username is already in use. 
    // - returns 2 if username is invalid (i.e. wrong format).
    static validateEmail(email){
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        let database = null;
        connectToDB()
        .then((db)=> {
            database = db;
            return db.collection('users');
        })
        .then((users) => {
            if users.find({$and:[{"email": email}]}).count()==1){ // email already in use
                return 1;
            } else {
                if (emailRegex.test(email)){ // email valid & available

                    return 0;

                } else { // email invalid

                    return 2;

                }
            }
            
        })
        .then((result) => {
            console.log(result);
            database.close();
        })
        .catch((err) => {
            console.error(err);
        })


    }
}

module.exports = DBClient;