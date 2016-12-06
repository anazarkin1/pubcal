$(document).ready(function () {
    // ======================================================
    // Helper function
    $("form input[type=submit]").click(function () {
        $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
        $(this).attr("clicked", "true");
    });


    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // This is the url to get the json object
    let url;
    if (window.location.href.substr(-1) === '/') {
        url = window.location.href;
    } else {
        url = window.location.href + '/';
    }
    var calendarURL = url + 'json';
    var downloadURL = url + 'download';
    var editURL = url + 'edit';

    $('#download-btn').attr('href', downloadURL);
    $('#edit-btn').attr('href', editURL);
    $('#remove-btn').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: url,
            method: 'delete',
            success: function (data) {
                window.location.href = '/';
            }
        });

    });

    // Get the calendar object
    $.getJSON(calendarURL, function (result) {
        var events = result.events;
        $('#calendarTitle').append(result.name);
        $('#descriptionBox').append(result.description);
        $('#owner').append(result.created_by);

        $.each(events, function (index, value) {
            var start = new Date(Date.parse(value.start));
            var end = new Date(Date.parse(value.end));
            value.start = start.yyyymmdd() + 'T' + start.hhmm();
            value.end = end.yyyymmdd() + 'T' + end.hhmm();
            value['title'] = value.name;

        })
        $('#calendar').fullCalendar({
            eventClick: function (calEvent, jsEvent, view) {
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
    // calendar = calendar['responseJSON'];
    // console.log(calendar);

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
    }


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
