"use strict";
const iCal = require('ical-generator'); //Used to generate ICAL files
const uuid = require('uuid');   //Used to generate random names for calendars
const path = require('path');
const fs = require('fs');   //Used to remove files from the disk

function convertEvent(item, index) {
    let eventDateKeys = ['start', 'end'];
    for (let key of eventDateKeys) {
        if (item.key != null)
            item.key = Date.parse(item.key);
    }
    if (item.repeating != null && item.repeating.length > 0) {
        item.repeating.map(convertRepeating);
    }
}

function convertRepeating(item, index) {
    let repeatingDateKeys = ['until'];
    for (let key of repeatingDateKeys) {
        if (item.key != null) {
            item.key = Date.parse(item.key);
        }
    }
}

class Helper {
    static createCalendar(newCal, calPath=null) {
        //Convert date from strings to Date objects
        if (newCal.events.length > 0) {
            newCal.events.map(convertEvent);
        }
        if (calPath === null) {
            let newName = uuid.v4().substr(0, 7);
            calPath = path.join(__dirname, '../calendars/' + newName + '.ics');
        }
        let cal = iCal(newCal);
        //Save to directory with all calendars
        cal.save(calPath);
        return calPath;
    }

    static deleteCalendar(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(filePath);
            });
        });
    }
}

module.exports = Helper;
