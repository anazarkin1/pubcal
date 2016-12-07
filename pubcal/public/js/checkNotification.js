function checkNotification(username, url){
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
	    		// v_names = [];
	    		// $('#notificationsBox a div p').each(function(){
	    		// 	v_names.push($(this).text()) 
	    		// });
	    		// console.log(v_names)
	    		$.each(result, function(i, v){
	    			targetUrl = url + "/../../calendars/" + v._id;
	    			// $("#notificationsBox").append("<a href = '" + targetUrl + "'>Hello</a>");
	    			$("#notificationsBox").append("<a href = '" + targetUrl + "'> <div class='w3-panel w3-blue w3-round w3-card-4'> <h3>"+ "Updated" + "</h3> <p>" + v.name + "</p></div></a>" );
	    		})
	    	}
	    	// setTimeout(checkNotification(username, url), 1000000);
	    }
	});
	// $("#notificationsBox").append("<a href = '" + "hi" + "'> </a>");
	// $("#notificationsBox").append("<a href = '" + hi + "'> <div class='w3-margin-top w3-margin-bottom scroll'> <h3>"+"</h3> <p>" + "hi" + "</p></div></a>" );
}
