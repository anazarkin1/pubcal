const express = require('express');
const router = express.Router();
const DBClient = require('../models/index');

// GET home page.
router.get('/', function(req, res, next) {
    DBClient.addUser({ name: 'Mioo Do', age: 89 });
    DBClient.updateUser(
        { name: 'Mioo Do' },
        { $set:  {age: 38} });
    DBClient.findAllUsers();
    res.render('index', { title: 'Express' });
});


// Handle login requests
router.post('/login', function(req, res){
	// TODO: give the user a unique session 

	// validate user id and password combination
	var user = DBClient.matchUserPassword(req.body.email, req.body.password);
	
	if (matchResult){// if successful, render profile page

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
		// adding new user to the database


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
	// should destroy session first

	// redirect user to the index page
	res.redirect('/');

});


module.exports = router;