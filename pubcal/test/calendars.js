"use strict";

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const request = require('supertest');
const chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
const fs = require('fs');
const mongoClient = require('mongodb').MongoClient;

let CalendarClient = require('../models/calendars');
chai.should();

describe('loading express', function () {
    var server;
    beforeEach(function () {
        delete require.cache[require.resolve('../app')];
        server = require('../app');
    });
    afterEach(function () {
        server.close();
    });
    it('responds to /', function testSlash(done) {
        request(server)
            .get('/')
            .expect(200, done);
    });
    it('404 everything else', function testPath(done) {
        request(server)
            .get('/not/supposed/to/get/here/')
            .expect(404, done);
    });

    it('Get a calendar ', function testPath(done) {
        let id = "";
        let url = "";
        let calendar;
        CalendarClient.getRandomCalendar().then((randomCalendar) => {
            calendar = randomCalendar;
            url = '/calendars/' + calendar._id + "/json";

            // Create a promise to test if ical file exits for this calendar
            return checkFileExists(calendar.filepath);
        }).then((exists) => {
            request(server)
                .get(url)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        throw new Error("Error: Failed test: " + err);
                    }
                    res.body._id.should.equal("" + calendar._id);
                    res.body._id.should.not.equal("shouldnotequaltothis" + calendar._id);
                    res.body.name.should.equal(calendar.name);
                    res.body.name.should.not.equal("shouldnotequaltothis" + calendar.name);
                    exists.should.equal(true);
                    done();
                })

        }).catch((err) => {
            console.log("ERROR: test failed :" + err);
            throw new Error("Caught promise error");
        });

    });

    it('Add a new calendar without reccuring events', function testPath(done) {
        let url = '/calendars/new';
        let data = {
            "calendar": {
                "created_by": "userid1",
                "description": "Calendar Description 123",
                "name": "Calendar name",
                "events": [
                    {
                        "description": "description 1",
                        "name": "event name 1",
                        "location": "Location 1",
                        "start": "Nov 01 2016 00:00:00 UTC",
                        "end": "Nov 30 2016 00:00:00 UTC",
                        "timezone": "Europe/Berlin",
                        "allDay": true
                    }
                ]
            }
        };

        request(server)
            .post(url)
            .send(data)
            .expect(200)
            .expect((res) => {
                res.body.status.should.equal("success");
                expect(res.body).to.have.property("id");
            })
            // .expect((res)=> {
            //     //check if ical file exists for this calendar
            //     return CalendarClient.getCalendarById(res.body.id)
            //         .then((calendar)=> {
            //             return checkFileExists(calendar.filepath + "asdf")
            //                 .then((result)=> {
            //                     return true;
            //                 })
            //                 .catch((err)=> {
            //                     return false
            //                 });
            //         })
            //         .then((result)=> {
            //             assert(true, result);
            //         })
            //
            // })
            .end((err, res) => {
                if (err) {
                    throw new Error(err)
                    done();
                }

                done();
            });
    });

    it('Add a new calendar with 1 repeating event', function testPath(done) {
        let url = '/calendars/new';
        let data = {
            "calendar": {

                "events": [
                    {
                        "description": "description",
                        "location": "Location",
                        "start": "Nov 01 2016 00:00:00 UTC",
                        "end": "Nov 30 2016 00:00:00 UTC",
                        "timezone": "Europe/Berlin",
                        "allDay": true,
                        "repeating": {
                            "freq": "DAILY",
                            "count": 10,
                            "interval": 3,
                            "until": "Nov 30 2016 00:00:00 UTC"
                        }
                    }
                ]
            }
        };

        request(server)
            .post(url)
            .send(data)
            .expect(200)
            .end((err, res) => {
                if (res.body.status != "success") {
                    throw new Error("returned status is not success");
                }
                if (!res.body.hasOwnProperty("id") || res.body.id === "") {
                    throw new Error("returned id is empty or non-existent");
                }
                done();
            });
    });

});

function checkFileExists(filepath) {
    return new Promise((resolve, reject) => {
        fs.access(filepath, (err) => {
            if (err) {
                reject(false);
            }
            resolve(true);
        });
    })
}
