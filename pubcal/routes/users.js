"use strict";

const express = require('express');
const router = express.Router();
const UserClient = require('../models/users');
const CalendarClient = require('../models/calendars');


// GET users listing.
router.get('/', (req, res) => {
    res.send('respond with a resource');
});

router.get('/createCalendar', (req, res) => {
    res.render('createCalendar', {email: req.session.user.email, username: req.session.user.username});
});

router.get('/getCalendarName/:id', (req, res) => {
    CalendarClient.getCalendarById(req.params.id)
        .then((result) => {
            res.send(result.name);
        });
});

router.get('/getMyCalendars/:userEmail', (req, res) => {
    let userEmail = req.params.userEmail;

    return UserClient.getCalendars(userEmail)
        .then((result) => {
            console.log(result);
            CalendarClient.getCalendarsByIds(result, (documents) => {
                console.log(documents);
                res.send(documents);
            });
        });
});

router.post('/subscribe/:id', (req, res) => {
    let username = req.body.username;
    let id = req.params.id;
    return UserClient.subscribe(username, id)
        .then((result) => {
            if (result.result.nModified) {
                CalendarClient.beSubscribed(id, username)
                    .then((result2) => {
                        res.json({status: 'subscribed'});
                    });
            }
        });
});

router.post('/unSubscribe/:id', (req, res) => {
    let username = req.body.username;
    let id = req.params.id;
    return UserClient.unSubscribe(username, id)
        .then((result) => {
            if (result.result.nModified) {
                CalendarClient.beUnSubscribed(id, username)
                    .then((result2) => {
                        res.json({status: 'unsubscribed'});
                    });
            }
        });
});

router.get('/:username/subscribed/:calid', (req, res) => {
    let username = req.params.username;
    let calID = req.params.calid;
    return UserClient.isSubscribed(username, calID)
        .then((isSubed) => {
            if (isSubed) {
                res.json({username: username, calendar: calID, status: "true"});
            }
            else {
                res.json({username: username, calendar: calID, status: "false"});
            }
        })
        .catch((err) => {
            if (err) {
                console.error(err);
                res.json({status: "Error"})
            }
        })

});

router.post('/getPendingNotification', (req, res) => {
    let username = req.params.username;
    return UserClient.getPendingNotification(username)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            if (err){
                console.error(err);
                res.json({status: "Error"})
            }
        })
});

module.exports = router;
