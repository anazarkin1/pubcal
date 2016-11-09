const express = require('express');
const generator = require('../libs/icalGeneratorHelper');

const router = express.Router();


// GET calendar listing.
router.get('/', function (req, res, next) {
    res.send('GET list of calendars');
});

// GET calendar form
router.get('/new', function (req, res, next) {
    res.render('calendars/new', {calendar: {}});
});

// POST calendar form
router.post('/new', function (req, res, next) {
    //TODO: need proper controller here
    let calendar = req.body.calendar;
    res.json(generator.createCalendar(calendar));
});

// GET a calendar with id
router.get('/:id', function (req, res, next) {
    res.send('GET calendar with id' + req.params.id);
});


module.exports = router;
