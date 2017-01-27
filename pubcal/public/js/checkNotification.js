var global_username;
function checkNotification(username, url){
	global_username = username;
	console.log('cheking');
	// let url = "/../users/getPendingNotification";
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
	    		$.each(result, function(i, v){
	    			targetUrl = url + "/../../calendars/" + v._id;
	    			$("#notificationsBox").append("<a href = '" + targetUrl + "'> <div class='w3-panel w3-blue w3-round w3-card-4'> <h3>"+ "Updated" + "</h3> <p>" + v.name + "</p></div></a>" );
	    		});
	    		$("#notificationsBox").append("<button class='w3-btn w3-white w3-border w3-border-red w3-round-xlarge w3-hover-red w3-text-red w3-margin' type='button' onclick='clearNotification()'>Clear All </button>");
	    	}

	    }
	});

}

function clearNotification(){
	$('#notificationsBox').empty();
	pathArray = location.href.split( '/' );
	protocol = pathArray[0];
	host = pathArray[2];
	let url = protocol + '//' + host;
	url = url + '/users/clearNotification';
	let data = JSON.stringify({"username": global_username});
	$.ajax({
	    url: url,
	    type: 'POST',
	    data: data,
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    success: function(result){
	    	console.log('success');
	    }
	});
}