const express = require('express');
const router = express.Router();
const UserClient = require('../models/users');
const CalendarClient = require('../models/calendars');

// GET users listing.
router.get('/', function(req, res, next) {
  	res.send('respond with a resource');
});

router.get('/createCalendar', function(req, res, next) {
	res.render('createCalendar');
  	
});

router.get('/getCalendarName/:id', function(req, res, next){

	CalendarClient.getCalendarById(req.params.id).then((result)=> {
		res.send(result.name); 
	});

});
router.get('/getMyCalendars/:userEmail', function(req, res, next) { 
	let userEmail = req.params.userEmail;
	UserClient.getCalendars(userEmail).then((result)=> {
			res.send(result);
		});
}); 
	

	


  	


module.exports = router;
