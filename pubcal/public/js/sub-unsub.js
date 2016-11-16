$(document).ready(function() {
	var username = $('#username').text();
	// var subscribed = $('#subscribed').text();
	var subscribed == 'true';
	var calID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1)

	if (subscribed == 'true') {
		$('#unsubscribe-btn').show();
		$('#subscribe-btn').hide();

	}
	else{
		$('#unsubscribe-btn').hide();
		$('#subscribe-btn').show();		
	};

	$('#subscribe-btn').click(function(e){
		e.preventDefault();
		// Get the calendar id
		// Do some ajax here
		var url = "../../users/subscribe/" + calID;
		$.ajax({
			url: url,
			type: 'POST',
			data: {
				username: username
			},
			dataType: "json",
			contentType: 'application/json'
		});



		$('#unsubscribe-btn').show();
		$('#subscribe-btn').hide();
	});


	$('#unsubscribe-btn').click(function(e){
		e.preventDefault();
		var url = "../../users/unsubscribe/" + calID;
		$.ajax({
			url: url,
			type: 'POST',
			data: {
				username: username
			},
			dataType: "json",
			contentType: 'application/json'
		});
		$('#unsubscribe-btn').hide();
		$('#subscribe-btn').show();
	});


});