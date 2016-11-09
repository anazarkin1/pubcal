"use strict";
const ical = require('ical-generator'); //Used to generate ICAL files
const path = require('path');

//@formatter:off
/*
 `newCal` is a JSON with data about a calendar that needs to be craete, with the following structure:
 For more information: https://www.npmjs.com/package/ical-generator
{
    domain: 'DOMAIN',
    name: 'CALENDARNAME'
    events: [
        {
            start: 'Date()', !! start's value is a string that was generate from Date object
            end: 'Date()',
            timestamp: 'Date()',
            summary: 'EVENTSUMMARY',
            organizer: 'ORGANIZER'
        },...
    ]
}

RETURNS: {
            status: 'success'|'failed', !! if failed, the rest keys are not supplied
            path: 'file_path_to_created_calendar',
            url: 'url_to_created_calendar'
         }

 */
//@formatter:on


exports.createCalendar = function createCalendar(newCal) {
    //Convert date from strings to Date objects
    if (newCal.events.length > 0) {
        newCal.events.map(convertEvent);
    }

    //add path (TODO: add autogenerating path, ITS FIXED NOW
    let calPath = path.join(__dirname, '../calendars/generatedCal.ics');

    let cal = ical(newCal);
    cal.saveSync(calPath);
    return cal;

};
/*
 Array of JSON dicts each representing an event, each value of such a dict is a string

 */

function convertEvent(item, index) {
    let eventDateKeys = ['start', 'end'];
    for (let key of eventDateKeys) {
        if (item.key != null)
            item.key = Date.parse(item.key);
    }

    if (item.repeating != null && item.repeating.length > 0) {
        item.repeating.map(convertRepeating);
    }

};

function convertRepeating(item, index) {
    let repeatingDateKeys = ['until'];
    for (let key of repeatingDateKeys) {
        if (item.key != null) {
            item.key = Date.parse(item.key);
        }
    }
};

