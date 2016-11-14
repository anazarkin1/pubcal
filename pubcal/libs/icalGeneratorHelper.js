"use strict";
const ical = require('ical-generator'); //Used to generate ICAL files
const uuid = require('uuid');   //Used to generate random names for calendars
const path = require('path');
const fs = require('fs');   //Used to remove files from the disk

exports.createCalendar = function createCalendar(newCal, calPath = null) {
    //ical format requries events names' to be called summaries
    //so we convert
    if (newCal.events.length > 0) {
        newCal.events.map(convertEventName);
    }

    if (calPath === null) {
        let newName = uuid.v4().substr(0, 7);
        calPath = path.join(__dirname, '../calendars/' + newName + '.ics');
    }

    let cal = ical(newCal);
    //Save to directory with all calendars
    cal.save(calPath);
    return calPath;

};

exports.deleteCalendar = function deleteCalendar(filepath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err) {
                reject(err);
            }
            resolve(filepath);
        });

    });
};

function convertEventName(item, index) {
    if ("name" in item) {
        item.summary = item.name;
    }
};

