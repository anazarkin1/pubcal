"use strict";
const session = require('client-sessions');
const express = require('express');
const router = express.Router();
const IndexClient = require('../models/index');
const CalendarClient = require('../models/calendars');
const UserClient = require('../models/users');

// session settings here
router.use(session({
    cookieName: 'session',
    secret: 'shush',
    duration: 30 * 60 * 1000, // each session is active for 30 minutes
    activeDuration: 5 * 60 * 1000, // any user interaction lengthen the session by 5 minutes.
}));

// middleware to handle session logic on each request
router.use((req, res, next) => {
    if (req.session && req.session.user) {
        let email = req.session.user.email;
        IndexClient.findUserByEmail(email)
            .then((result) => {
                if (result) {
                    // TODO: nathan -> eddie: WHY ASSIGN RESULT TO MULTIPLE VARIABLES
                    // req.user is the important one, it keeps track of the session user.
                    // req.session.user pulls information from cookie which is subject to changes.
                    req.user = result;
                    delete req.user.password;
                    req.session.user = result;
                    res.locals.user = result;
                }
            });
    }
    next();
});


function index(req, res) {
    // TODO: WHY THIS CHECKING CONDITION
    if (!(req.session && req.session.user)) {
        res.render('index', {title: 'Express'});
    } else {
        res.render('index', {title: 'Express', email: req.session.user.email});
        // res.render('profile_sample', {
        //     // passing current user's email address for testing
        //     email: req.session.user.email
        // });
    }
}

// function to ensure that a user is logged in when accessing login-required pages.
function requireLogin(req, res, next) {
    if (!req.user) {
        res.redirect('/');
    } else {
        next();
    }
}

router.get('/', (req, res) => {
    return index(req, res);
});

// Handles profile requests. (host/profile)
router.get('/profile', (req, res) => {
    if (!(req.session && req.session.user)) {
        res.render('index', {title: 'Express'});
    } else {
        res.render('profile', {
            // passing current user's email address for testing
            email: req.session.user.email
        });
    }
});

router.get('/loadSettings', (req, res)=>{
    if (!(req.session && req.session.user)) {
        res.render('index', {title: 'Express'});
    } else {
        res.render('acctSettings', {
            // passing current user's email address for testing
            email: req.session.user.email
        });
    }


});

// Handle login requests
router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    IndexClient.login(email, password)
        .then((result) => {
            if (result) {
                req.session.user = result;
                // res.render('profile', { // when matching user is found, load profile page.
                //     email: req.session.user.email
                // });
                res.redirect('/profile');
            } else { // no matching user is found, load index page
                res.redirect('/');
            }
        });
});

router.get('/login', (req, res) => {
    return index(req, res);
});



// Handle signup requests
router.post('/signup', (req, res) => {
    // take email address -> check if it already exists
    //					  -> check if valid format
    // take username -> check if it already exists
    // take password -> check if it has > 8 characters

    let usrRegex = new RegExp('^[a-zA-Z0-9äöüÄÖÜ]*$');
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let email = req.body.emailNew;
    let username = req.body.username;
    let password = req.body.passwordNew;
    let passwordConfirm = req.body.confirmPassword;

    let errMessage;
    var hasError = 1;
    if (!usrRegex.test(username)) { // invalid username. load index with error message
        errMessage = 'username invalid format';
    } else if (!emailRegex.test(email)) { // invalid email. load index with error message
        errMessage = 'email invalid format';
    } else if (password.length < 8) { // prompt user to provide different password
        errMessage = "password must be at least 8 characters";
    } else if (password !== passwordConfirm) {
        errMessage = "confirmPassword is different";
    } else {
        hasError = 0;
    }

    if (hasError) {
        res.render('index', {
            errors: errMessage
        });
    }

    IndexClient.findUserByEmail(email)
        .then((result) => {
            if (result) {
                res.render('index', {
                    errors: 'username already in use'
                });
            } else {
                let user = {
                    username: username,
                    password: password,
                    email: email,
                    subscribed_to: []
                };
                UserClient.addUser(user)
                    .then((result) => {
                        req.user = result;
                        delete req.user.password;
                        req.session.user = result;
                        res.locals.user = result;

                        res.render('profile', {
                            email: req.session.user.email
                        });
                    });
            }
        });
});


router.post("/updatePassword", (req, res) =>{

    let email = req.session.user.email;

    let cPassword = req.body.cPassword;
    let nPassword = req.body.nPassword;
    let ncPassword = req.body.ncPassword;
    if (nPassword != ncPassword){
        res.render('profile', {
            errors: "new passwords does not match"
        });
    }

    IndexClient.findUserByEmailAndPassword(email, cPassword, nPassword)
    .then((result) => {
        if (result) {
            Index.Client.updatePassword(email, nPassword);
        }
    });
});


//GET /calendars/search
router.get('/search', (req, res) => {
    let query = "";
    let skip = 0;
    if ("q" in req.query)
        query = req.query.q;
    if ("skip" in req.query)
        skip = req.query.skip;

    CalendarClient.searchForCalendars(query, skip, (result) => {
        if (result != null) {
            console.log(result);
            try {
                if (typeof req.session.user.email != 'undefined' || req.session.user.email != null){
                    res.render('result', {'result': result, 'hostname': req.hostname, 'email': req.session.user.email});    
                }
                else{
                    res.render('result', {'result': result, 'hostname': req.hostname});
                }    
            }
            catch(err){
                res.render('result', {'result': result, 'hostname': req.hostname});
            }
            
        } else {
            res.render('result', {'errors': 'No calendar matched your search'});
        }
    })
});

// Handle logout requests
router.get('/logout', (req, res) => {
    // should reset session first
    if (req.session) {
        req.session.reset();
    }
    res.redirect('/');
});

router.get('/topFivePopular', (req, res) => {
    UserClient.getTopFiveUsers((users) => {
        CalendarClient.getTopFiveCalendars((calendars) => {
            res.render('/', {
                users: users,
                calendars: calendars
            });
        })
    })
});

// router.get('/updatedCalendars', (req, res) => {
//     res.render('updatedCalendars', {});
// });

module.exports = router;
