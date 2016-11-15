const express = require('express');
const router = express.Router();
const UserClient = require('../models/users');
const CalendarClient = require('../models/calendars');


// GET users listing.
router.get('/', (req, res) => {
  	res.send('respond with a resource');
});

router.get('/createCalendar', (req, res) => {
	res.render('createCalendar');
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
            if (result.nModified) {
                CalendarClient.getSubscribed(id, username)
                    .then((result2) => {
                        // TODO: SUCCESS, SEND TO FRONT END
                    });
            }
        });

});

module.exports = router;
