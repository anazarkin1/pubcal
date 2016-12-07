function checkNotification(username, url){
	let data = JSON.stringify({"username": username});
	// Clear the previous notifications
	$('#notificationsBox').empty();
	$.ajax({
	    url: url,
	    type: 'POST',
	    data: data,
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    success: function(result){
	    	if (result.length != 0){
	    		$.each(result, function(k, v){
	    			targetUrl = url + "/../../calendars/" + v;
	    			$("#notificationsBox").append("<a href = '" + targetUrl + "'> <div class='w3-margin-top w3-margin-bottom scroll'> <h3>" + v + "</h3> <p>" + k + "</p></div></a>" );
	    		})
	    	}
	    	setTimeout(checkNotification(username, url), 3000);
	    }
	});

}
