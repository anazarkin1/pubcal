"use strict";
const express = require('express');
const router = express.Router();
const CalendarClient = require('../models/calendars');
const helper = require('../libs/icalGeneratorHelper');

//Download ical file for a calendar with id = :id
//GET /calendars/:id/download
router.get('/:id/download', (req, res)=> {
    let id = req.params.id;
    let filePath = null;
    let filename = null;
    CalendarClient.getCalendarById(id)
        .then((calendar) => {
            filePath = calendar.filepath;

            //filename is the last element of splitted array
            filename = filePath.split("/").slice(-1)[0];

            //added manual headers only to make downloading files have a proper filename,
            //without them it downloads as 'download' file.
            let options = {
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true,
                    'content-disposition': "attachment; filename=" + filename
                }
            };

            res.sendFile(filePath, options, (err) => {
                if (err) {
                    console.log("ERROR: failed to serve calendar file: " + err);
                    res.status(404).send("Error, we couldn't find this calendar");
                }
            });
        }).catch((err) => {
            console.log("ERROR: failed to serve calendar file: " + err);
            res.send("Error, no such calendar");
        });
});

router.get('/import', (req, res)=> {
    //TODO: implement
    res.render('calendars/import');
});

//Get particular by id
//Get /calendars/:id
router.get('/:id', (req, res)=> {
    let id = req.params.id;

    //TODO: WE don't want to return ALL fields of calendar object(ie user doesn't need to know filepath, user_subscribed etc...)
    CalendarClient.getCalendarById(id)
        .then((calendar) => {
            res.send(calendar);
    });
});

//Get index of calendars
//GET /calendars/
router.get('/', (req, res) => {
    res.send('GET list of calendars');
});

//Get form for creating a calendar
//GET /calendars/new
router.get('/new', (req, res) => {
    res.render('createCalendar');
});

//Send calendar data to create a new calendar
//POST /calendars/new
router.post('/new', (req, res) => {
    //check if calendar was sent to us
    if (!req.body.hasOwnProperty("calendar")) {
        res.json({"status": "failed"});
        // TODO: BY NATHAN, WHAT'S THE RETURN HERE
        return;
    }
    let calendar = req.body.calendar;

    let createCalendarFile = new Promise((resolve) => {
        let filePath = helper.createCalendar(calendar);
        resolve(filePath);
    });

    createCalendarFile
        .then((filePath) => {

        //Construct list of subscribed users
        calendar.users_subscribed = [];
        //Add creator as a subscriber
        calendar.users_subscribed.push(calendar.created_by);
        //Add filePath generated by helper
        calendar.filepath = filePath;

        CalendarClient.addCalendar(calendar)
            .then((result) => {
                if (result.result.ok == 1) {
                    res.json({"status": "success", "id": result.insertedId});
                } else {
                    console.error("Failed inserting new calendar into db");
                    res.json({"status": "failed"});
                }
            })
    });
});

//POST /calendars/search
router.post('/search', (req, res) => {
    let tag = req.body.tag;
    CalendarClient.searchForCalendars(tag, (result) => {
        if (!result.length) { // not found
            res.render('index_sample', {
                errors: 'no calendar matches your request'
            });
        } else {
            res.render('calendar_result_sample', {
                calendarResult: JSON.stringify(result)
            });
        }
    })
});

//Update a calendar by id
//PUT /calendars/:id
router.put('/:id', (req, res) => {
    if (!req.body.hasOwnProperty("calendar")) {
        res.json({status: "failed"});
        return;
    }
    let id = req.params.id;
    let calendar = req.body.calendar;

    CalendarClient.getCalendarById(id)
        .then((oldCalendar) => {
            //Get old calendar, copy its users and filepath, since we want to preserve this information
            //and frontend doesn't send this to us(for security)
            calendar.users_subscribed = oldCalendar.users_subscribed.slice();
            calendar.filepath = oldCalendar.filepath;
            return calendar;
        })
        .then((newCalendar)=> {
            //Replace calendar object in the database first, newCalendar contains copied users and filepath
            CalendarClient.replaceCalendar(id, newCalendar)
                .then((result) => {
                    if (result.modifiedCount == 1) {
                        //We are NOT doing upsert, so if modifiedCount >0, means that there was an actual record
                        //that we modified which is good
                        new Promise((resolve) => {
                            //We want to create a new ical file on the disk with the same filepath(filename) as
                            let filePath = helper.createCalendar(newCalendar, newCalendar.filepath);
                            resolve(filePath);
                        })
                            .then((filePath) => {
                                if (filePath === newCalendar.filepath) {
                                    res.json({"status": "success", "id": id});
                                }
                                else {
                                    //Something went horribly wrong
                                    console.log("ERROR: Promise returned a different file path than expected");
                                    res.json({"status": "failed"});
                                }
                            })
                            .catch((err) => {
                                console.log("ERROR: Failed on promise to update file: " + err);
                                res.json({"status": "failed"});
                            });
                    } else {
                        //We didn't find any documents with such id in the database
                        console.log("ERROR: failed to update calendar in database");
                        res.json({"status": "failed"});
                    }
                });
        });
});

//DELETE /calendars/:id
router.delete('/:id', (req, res) => {
    let id = req.params.id;

    //Keep old copy of calendar in case we need to restore it
    //For example: we removed database object, but disk file failed to get removed and we want to revert everything back
    let tmpCalendar;
    CalendarClient.getCalendarById(id).then((calendar)=> {
        tmpCalendar = calendar;
    }).then(()=> {

        //Remove database object
        CalendarClient.removeCalendarById(id)
            .then((result) => {
                if (result.result.ok == 1 && result.result.n == 1) {
                    //Successful delete inside db
                    //Do file delete
                    helper.deleteCalendar(tmpCalendar.filepath)
                        .then((result) => {
                            //Successfully removed file
                            res.json({"status": "success"});
                        })
                        .catch((err) => {
                            console.log("ERROR: failed to remove calendar file: " + err);
                            res.json({"status": "failed"});
                        });
                } else {
                    console.log("ERROR: Failed to delete calendar from database");
                    res.json({"status": "failed"});
                }
            });
    });
});


//Import iCal file
//POST /calendars/import
router.post('/import', (req, res)=> {
    //TODO: implement
    res.send("not implemented");
});

module.exports = router;
