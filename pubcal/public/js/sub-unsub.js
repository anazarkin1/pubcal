"use strict";
$(document).ready(function () {
    var username = $('#username').text();
    var subscribed = $('#subscribed').text();
    var calID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1)

    if (subscribed == 'false') {
        $('#unsubscribe-btn').hide();
        $('#subscribe-btn').show();

    }
    else {
        $('#unsubscribe-btn').show();
        $('#subscribe-btn').hide();
    }
    ;

    $('#subscribe-btn').click(function (e) {
        e.preventDefault();
        let url = "/users/subscribe/" + calID;
        let data = JSON.stringify({"username": username});
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (data) => {
                $('#unsubscribe-btn').show();
                $('#subscribe-btn').hide();
            }
        });


    });


    $('#unsubscribe-btn').click(function (e) {
        e.preventDefault();
        let url = "/users/unsubscribe/" + calID;
        let data = JSON.stringify({"username": username});
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $('#unsubscribe-btn').hide();
                $('#subscribe-btn').show();

            }
        });
    });


});