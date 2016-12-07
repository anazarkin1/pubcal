$(document).ready(function () {

	if ($(".username-field").first().text() != null){
	    // setInterval(checkNotification($(".username-field").first().text(), "../../users/getPendingNotification"), 3000);   
	    setInterval(checkNotification($(".username-field").first().text(), "/users/getPendingNotification"), 3000);    

	}   


})