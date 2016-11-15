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

    $('#calendar').fullCalendar({
        eventClick: function (calEvent, jsEvent, view) {
            modal.style.display = "block";
            modifyBox.style.display = "block";
            $('#selectedTitle').val(calEvent.title);
            $('#selectedStart').val(calEvent.start._d.yyyymmdd());
            $('#selectedStartTime').val(calEvent.start._d.hhmm());
            $('#selectedID').val(calEvent.id);
            $('#selectedDescription').val(calEvent.description);
            $('#selectedEnd').val(calEvent.end._d.yyyymmdd());
            $('#selectedEndTime').val(calEvent.end._d.hhmm());


        },
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        },
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: [
            {
                id: 1,
                title: 'All Day Event',
                start: '2016-09-01'
            },
            {
                id: 2,
                title: 'Long Event',
                start: '2016-09-07',
                end: '2016-09-10'
            },
            {
                id: 3,
                title: 'Repeating Event',
                start: '2016-09-09T16:00:00'
            },
            {
                id: 4,
                title: 'Repeating Event',
                start: '2016-09-16T16:00:00'
            },
            {
                id: 5,
                title: 'Conference',
                start: '2016-09-11',
                end: '2016-09-13',
                description: 'I am a description'
            },
            {
                id: 6,
                title: 'Meeting',
                start: '2016-09-12T10:30:00',
                end: '2016-09-12T12:30:00'
            },
            {
                id: 7,
                title: 'Lunch',
                start: '2016-09-12T09:00:00'
            },
            {
                id: 8,
                title: 'Meeting',
                start: '2016-09-12T14:30:00'
            },
            {
                id: 9,
                title: 'Happy Hour',
                start: '2016-09-12T17:30:00'
            },
            {
                id: 10,
                title: 'Dinner',
                start: '2016-09-12T20:00:00'
            },
            {
                id: 11,
                title: 'Birthday Party',
                start: '2016-09-13T07:00:00'
            },
            {
                id: 12,
                title: 'Click for Google',
                start: '2016-09-28'
            }
        ],
        selectable: true,
        selectHelper: true,
        select: function (start, end, allDay) {

            modal.style.display = "block";
            addBox.style.display = "block";
            $('#newStart').val(start._d.yyyymmdd());
            $('#newEnd').val(end._d.yyyymmdd());
            // Reset the field
            $('#newTitle').val('');
            $('#newDescription').val('');

        }

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
            url: '/calendars/new',
            type: 'POST',
            data: JSON.stringify(data_to_send),
            dataType: "json",
            contentType: 'application/json',
            success: function(result){
                alert('success');
                next_hop_url = "http://localhost:3000/calendars/" + result.id;
                window.location.href = next_hop_url;
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
