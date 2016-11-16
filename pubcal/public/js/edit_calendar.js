$(document).ready(function () {
    // ======================================================
    // Helper function
    $("form input[type=submit]").click(function () {
        $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
        $(this).attr("clicked", "true");
    });


    // Get the modal
    var modal = document.getElementById('myModal');
    var modifyBox = document.getElementById('modifyEvent');
    var addBox = document.getElementById('addEvent');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    var calendarURL = window.location.href + '/../json';

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        dismissPopUp();

    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            dismissPopUp();
        }
    }
    function dismissPopUp() {
        modal.style.display = "none";
        modifyBox.style.display = "none";
        addBox.style.display = "none";
    }

    // =========================================
    // This is the calendar mechanism
    $.getJSON(calendarURL, function(result){
        var events = result.events;
        $('#cal_title').val(result.name);
        $('#cal_description').val(result.description);

        $.each(events, function(index, value){
            var start = new Date(Date.parse(value.start));
            var end = new Date(Date.parse(value.end));
            value.start = start.yyyymmdd() + 'T' + start.hhmm();
            value.end = end.yyyymmdd() + 'T' + end.hhmm();
            value['title'] = value.name;

        })
        $('#calendar').fullCalendar({
            eventClick: function(calEvent, jsEvent, view) {
                modal.style.display = "block";
                // Clear previous info
                $('.eventInfo').html('&nbsp')
                // Add new info
                $('#eventTitle').append(calEvent.title);
                $('#eventStart').append(calEvent.start._d.yyyymmdd());
                $('#eventStartTime').append(calEvent.start._d.hhmm());
                $('#eventDescription').append(calEvent.description);
                $('#eventEnd').append(calEvent.end._d.yyyymmdd());
                $('#eventEndTime').append(calEvent.end._d.hhmm());


            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listWeek'
            },
            navLinks: true, // can click day/week names to navigate views
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events: events,
            selectable: true,
            selectHelper: true
        });
    });

    $('#modifyEvent').submit(function (e) {
        e.preventDefault();
        var val = $("#modifyEvent input[type=submit][clicked=true]").val();
        if (val == 'update event') {
            var event = $('#calendar').fullCalendar('clientEvents', $('#selectedID').val())[0];
            var start_date = $('#selectedStart').val();
            var end_date = $('#selectedEnd').val();
            var start_time = $('#selectedStartTime').val();
            var end_time = $('#selectedEndTime').val();

            event.title = $('#selectedTitle').val();
            event.start = start_time ? start_date + 'T' + start_time + ':00' : start_date;
            event.end = end_time ? end_date + 'T' + end_time + ':00' : end_date;
            event.description = $('#selectedDescription').val();
            event.allDay = ((start_time == '00:00' || start_time == '') && (end_time == '00:00' || end_time == '')) ? true : false;
            $('#calendar').fullCalendar('updateEvent', event);

        }
        else if (val == 'remove event') {
            $('#calendar').fullCalendar('removeEvents', $('#selectedID').val());
        }
        else {

        }
        dismissPopUp();
    });


    $('#addEvent').submit(function (e) {
        e.preventDefault();
        var title = $('#newTitle').val()
        if (title) {
            var start_date = $('#newStart').val();
            var end_date = $('#newEnd').val();
            var start_time = $('#newStartTime').val();
            var end_time = $('#newEndTime').val();

            $('#calendar').fullCalendar('renderEvent',
                {
                    title: $('#newTitle').val(),
                    start: start_time ? start_date + 'T' + start_time + ':00' : start_date,
                    end: end_time ? end_date + 'T' + end_time + ':00' : end_date,
                    description: $('#newDescription').val(),
                    allDay: ((start_time == '00:00' || start_time == '') && (end_time == '00:00' || end_time == '')) ? true : false,
                    id: getNextID()
                },
                true // make the event "stick"
            );
        }
        $('#calendar').fullCalendar('unselect');
        modal.style.display = "none";
        modifyBox.style.display = "none";
        addBox.style.display = "none";

    });
    $('#submitButton').click('submit', function (e) {
        e.preventDefault();
        var output_events = [];
        for (var i = 0; i < $('#calendar').fullCalendar('clientEvents').length; i++) {
            var obj = $('#calendar').fullCalendar('clientEvents')[i];
            var tmp_event = {};
            tmp_event.description = obj.description;
            tmp_event.id = obj.id;
            tmp_event.name = obj.title;
            tmp_event.start = obj.start._d;
            tmp_event.end = obj.end ? obj.end._d : null;
            tmp_event.allDay = obj.allDay;
            output_events.push(tmp_event);
        }
        var data_to_send = {
            calendar: {
                created_by: "userid1",
                description: $('#cal_description').val(),
                name: $('#cal_title').val(),
                events: output_events
            }
        };

        $.ajax({
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Accept", "application/json");
            },
            url: window.location.href + '/..',
            type: 'PUT',
            data: JSON.stringify(data_to_send),
            dataType: "json",
            contentType: 'application/json',
            success: function(result){
                alert('success');
                var current_url = window.location.href + '/..';
                window.location.href = current_url;
            }
        });

        // var events = $('#calendar').fullCalendar('clientEvents');
        console.log(data_to_send);

    });
    // Return the next id when creating an event
    function getNextID() {
        var events = $('#calendar').fullCalendar('clientEvents');
        var id_list = [];
        $.each(events, function (index, value) {
            id_list.push(value.id);
        });
        if (id_list.length == 0) {
            return 1;
        }
        else {
            return Math.max.apply(null, id_list) + 1;
        }
    };

    Date.prototype.yyyymmdd = function () {
        // var tomorrow = new Date(this.getTime());
        // tomorrow.setDate(this.getDate() + 1);
        var mm = this.getUTCMonth() + 1; // getMonth() is zero-based
        var dd = this.getUTCDate();
        mm = mm < 10 ? "0" + mm : mm;
        dd = dd < 10 ? "0" + dd : dd;
        return [this.getFullYear(), mm, dd].join('-'); // padding
    };
    Date.prototype.hhmm = function () {
        console.log(this);
        var hh = (this.getUTCHours());
        hh = hh < 10 ? "0" + hh : hh;
        var mm = this.getUTCMinutes();
        mm = mm < 10 ? "0" + mm : mm;

        return [hh, mm].join(':'); // padding
    };

});
