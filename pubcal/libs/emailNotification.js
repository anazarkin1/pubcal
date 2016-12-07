"use strict";
var api = "key-02fbdaf7eded154a2febcf4b706e5884";
var domain = "sandbox38d75d74615d4d8a86c99cb1482a08ec.mailgun.org";

const path = require('path');
const fs = require('fs');   //Used to remove files from the disk
const mailgun = require('mailgun-js')({apiKey: api, domain: domain});

function sendEmail(users, calURL, calendar, next) {
    //get list of emails
    let isError = false;
    let errMsg = "";
    let msgtxt = "Calendar \'" + calendar.name + "\' was recently updated. You can take a look at " + calURL;
    let msghtml = "<html>Calendar \'<bold>" + calendar.name + "</bold>\' was recently updated. You can take a look at <a href=\"" + calURL + "\">" + calURL + "</a>";

    users.map((user, index) => {
        let email = user.email;
        let data = {
            from: 'PubCal <me@samples.mailgun.org>',
            to: email,
            subject: 'Calendar \'' + calendar.name + '\' got updated!',
            text: msgtxt,
            html: msghtml
        };
        mailgun.messages().send(data, function (error, body) {
            //Right now it fails because we don't have a domain name
            //So there is not point really to catch errors, since we would always get error
            isError = true;
            errMsg = body;
        });
    });

    if (isError) {
        next(false, errMsg);
    } else {
        next(true);
    }
}

module.exports = sendEmail;
