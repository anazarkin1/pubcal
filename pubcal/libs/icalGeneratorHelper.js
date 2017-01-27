"use strict";
const iCal = require('ical-generator'); //Used to generate ICAL files
const uuid = require('uuid');   //Used to generate random names for calendars
const path = require('path');
const fs = require('fs');   //Used to remove files from the disk

function convertEvent(item, index) {
    if ("name" in item) {
        item.summary = item.name;
    }
}

class Helper {
    static createCalendar(newCal, calPath = null) {
        //ical format requries events names' to be called summaries
        //so we add summary to every event that equals to name
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
