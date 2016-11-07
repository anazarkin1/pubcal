const express = require('express');
const router = express.Router();
const DBClient = require('../models/index');
const ObjectID = require('mongodb').ObjectID;


// Session settings here.
router.use(session({
    cookieName: 'session',
    secret: 'shush',
    duration: 30 * 60 * 1000, // each session is active for 30 minutes 
    activeDuration: 5 * 60 * 1000, // any user interaction lengthen the session by 5 minutes.
}));

// middleware to handle session logic on each request
router.use(function(req, res, next){
	if (req.session && req.session.user){
		var user = DBClient.lookupUser(req.session.user.email);
		if (user) {
			req.user = user;
			delete req.user.password;
			req.session.user = user;
			res.locals.user = user;
		}

		next();
	} else {
		next();
	}
});

// function to ensure that a user is logged in when accessing login-required pages.
function requireLogin(req, res, next) {
	if (!req.user){
		res.redirect('/login');
	} else {
		next();
	}
};

// GET home page.
router.get('/', function(req, res, next) {
    DBClient.addUser({ name: 'Mioo Do', age: 89 });
    DBClient.updateUser(
        { name: 'Mioo Do' },
        { $set:  {age: 38} });
    DBClient.findAllUsers();
    res.render('index', { title: 'Express' });
});

// Handles profile requests. (host/profile)
router.get('/profile', requireLogin, function(req, res){

	res.render('profile');

});

// Handle login requests
router.post('/login', function(req, res){
	
	// validate user id and password combination
	var user = DBClient.matchUserPassword(req.body.email, req.body.password);
	
	if (matchResult){// if successful, render profile page

		// TODO: give the user a unique session 
		req.session.user = user;
		res.render('profile');

	} else {// if not, ask for right combination

		res.render('login');
	}
	


});


// Handle signup requests
router.post('/signup', function(req, res){

	// take email address -> check if it already exists
	//					  -> check if valid format
	// take username -> check if it already exists
	// take password -> check if it has > 8 characters

	// TODO: Figure out if users are required to provide additional account info

	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;

	if (DBClient.validateUsername(username)==0 && DBClient.validateEmail(email)==0){ //both username and email valid & available

		// Create new user object
		var objectId = newObjectID();
		var newUser = {
			_id: objectId,
			username: username,
			password: password,
			email: email,
			subscribed_to: []
		}

		// adding new user to the database
		DBClient.addUser(newUser);


	} else if (DBClient.validateUsername(username) == 1) { // prompt user to provide different email
		res.render('signup', {
			errors: "email already in use"
		});

	} else if (DBClient.validateEmail(email) == 1) { // prompt user to provide different username
		res.render('signup', {
			errors: "username already in use"
		});

	} else if (DBClient.validateUsername(username) == 2){ // prompt user that username is invalid

		res.render('signup', {
			errors: "username invalid format"
		});

	} else if (DBClient.validateEmail(email) == 2){  // prompt user that email is invalid

		res.render('signup', {
			errors: "email invalid format"
		});

	} else if (password.length < 8){ // prompt user to provide different password

		res.render('signup', {
			errors: "password must be at least 8 characters"
		});
	}



});


// Handle logout requests
router.post('logout', function(req, res){

	// should reset session first
	req.session.reset();

	// redirect user to the index page
	res.redirect('/');

});


module.exports = router;