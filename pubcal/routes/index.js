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

module.exports = router;