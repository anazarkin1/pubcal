const express = require('express');
const router = express.Router();
const DBClient = require('../models/index');
const session = require('client-sessions');

// session settings here
router.use(session({
    cookieName: 'session',
    secret: 'shush',
    duration: 30 * 60 * 1000, // each session is active for 30 minutes 
    activeDuration: 5 * 60 * 1000, // any user interaction lengthen the session by 5 minutes.
}));

// middleware to handle session logic on each request
router.use((req, res, next) => {
    if (req.session && req.session.user){
        DBClient.lookupUser(req, res, next);
    } else {
        next();
    }
});

// function to ensure that a user is logged in when accessing login-required pages.
function requireLogin(req, res, next) {
	if (!req.user) {
		res.redirect('/');
	} else {
		next();
	}
}

router.get('/', (req, res) => {
	if (!(req.session && req.session.user)){
		res.render('index_sample', { title: 'Express' });
	} else {
		res.render('profile_sample', {
			// passing current user's email address for testing 
			email: req.session.user.email
		});
	}
});

// Handles profile requests. (host/profile)
router.get('/profile', requireLogin, (req, res) => {
	res.render('profile_sample', {
		// passing current user's email address for testing 
		email: req.session.user.email
	});
});

// Handle login requests
router.post('/login', (req, res) => {
	var email = req.body.email;
	var password = req.body.password;
	DBClient.login(email, password, req, res);
});

// Handle signup requests
router.post('/signup', (req, res) => {
	// take email address -> check if it already exists
	//					  -> check if valid format
	// take username -> check if it already exists
	// take password -> check if it has > 8 characters

	// TODO: Figure out if users are required to provide additional account info

	var email = req.body.emailNew;
	var username = req.body.username;
	var password = req.body.passwordNew;
	var passwordConfirm = req.body.confirmPassword;

	if (password.length < 8){ // prompt user to provide different password

		res.render('index_sample', {
			errors: "password must be at least 8 characters"
		});
	} else if (password !== passwordConfirm) {
		res.render('index_sample', {
			errors: "confirmPassword is different"
		});
	}
	DBClient.addUser(email, username, password, req, res);
});

// Handle logout requests
router.post('/logout', (req, res) => {
	// should reset session first
	if (req.session) {
		req.session.reset();
	}
	res.redirect('/');
});

router.post('/searchCalendars', (req, res) => {
    let tag = req.body.tag;
    DBClient.searchForCalendars(tag, res);
});

module.exports = router;
