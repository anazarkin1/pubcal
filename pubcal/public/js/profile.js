/*
 * Some functions are adopted from my own project from CSC309  
 */

$(document).ready(function(){
    let email = $(".email-field").html();
    let username = $(".username-field").html();
    
    $('#snackbar').text("Hello " + username + ", you just logged in!").addClass('show');
    setTimeout(() => {
        $('#snackbar').removeClass('show');
    }, 2000);

	var navs = document.getElementsByClassName("main-nav-button");
	var info = document.getElementsByClassName("profile-info");
	var disabledBox = document.getElementsByClassName("edit-disable");
	var editButtons =document.getElementsByClassName("edit-img");
   
	for (i=0; i < editButtons.length+1; i++) {

		$("#edit-button" + i).click(function(event){
			var curr = this.id.substring(11);
			
			$("#newEmailError").html(" ");
			enableEdit(disabledBox, curr);			
		});
	}

	// watch for the buttons clicked to change contents of profile page
	for (i=1; i < navs.length+1; i++){

		$("a#nav" + i).click(function(event){

			var curr = this.id.substring(3);

			processMenu(curr, navs);
			// TODO: gotta change names in CSS for these ID's

			if (navs[curr-1].id === 'mycalendars'){ // show all subscribed calendars
				
				listInfo(curr, info);
				getMyCalendars();

			} else if (navs[curr-1].id === 'accountsettings'){ // redirect to create calendar page
				
				listInfo(curr, info);


			}
			
		});
	}
	
	// validate currnet password
	$("#cpw").on("input", function(event){
		if($("#npw").val().length > 0 && $("#ncpw").val().length > 0 && event.target.value.length >0 &&
			$("#ncpw").val() == $('#npw').val() ) {
				$("#updatePW").attr("disabled", false);
		} else {
			$("#updatePW").attr("disabled", true);
		}
	});

	// validate new password
	$("#npw").on("input", function(event) {
		if (event.target.value != $("#ncpw").val() && $("#ncpw").val().length != 0 && event.target.value.length != 0 ) {
			
			$(".error.pw").html("password must match!");
			$("#updatePW").attr("disabled", true);
		} else {
			$(".error.pw").html(" ");
			if ($("#npw").val().length > 0 && $("#ncpw").val().length > 0 && $('#cpw').val().length >0){
				$("#updatePW").attr("disabled", false);
				
			}
		}
	}); 

	// match passwords
	$("#ncpw").on("input", function(event) {
		if (event.target.value != $("#npw").val() && $("#npw").val().length != 0 && event.target.value.length != 0) {	
			$("#updatePW").attr("disabled", true);		
			$(".error.pw").html("password must match!");
		} else {
			$(".error.pw").html(" ");
			if ($("#npw").val().length > 0 && $("#ncpw").val().length > 0 && $('#cpw').val().length >0){
				$("#updatePW").attr("disabled", false);
				
			}
		}
	});

    if ($(".username-field").first().text() != null){
        checkNotification($(".username-field").first().text(), "../../users/getPendingNotification");
    }	

});

function enableEdit(disabledBox, i){
	var actionURL;
	var input_type;
	var input_name;
	var input_value;
	switch (i) {
		case "1":
			actionURL = "/update_email";
			input_type = "email";
			input_name = "newEmailValue";
			placeholder = "Email Address";
			
			break;
		case "2":
			actionURL = "/update_name";
			input_type = "text";
			input_name = "newNameFirst";
			placeholder = "First Name";
			
		case "3":
			actionURL = "/update_address";
			input_type = "text";
			input_name = "newCity";
			placeholder = "city";
			break;
		case "4":
			actionURL = "/update_phone";
			input_type = "text";
			input_name = "newPhone";
			placeholder = "phone number...";
			break;
		case "5":
			actionURL = "/update_dob";
			input_type = "text";
			input_name = "newDOB";
			placeholder = "Day-Month-Date-Year";
			break;
		case "6":
			actionURL = "/update_gender";
			input_type = "text";
			input_name = "newGender";
			placeholder = "Enter M or F or O";
			break;
		case "7":
			actionURL = "/update_desc";
			input_type = "text";
			input_name = "newDesc";
			placeholder = "Description....";
			break;		
		default:
			alert("not catched");
	}


	disabledBox[i-1].className += " hidden";
	$('<div>', {
		'class': "edit-enable" + i
	}).appendTo(".edit-box.e" + i);

	$('<form>', {
		'class': "edit-value" + i,
		'action': actionURL,
		'method': "post"
	}).appendTo(".edit-enable" + i);

	$('<div>', {
		'class': "input-zone" + i
	}).appendTo(".edit-value"+i );

	if(i != "7") {

	$('<input>', {
		'class': "new-input" + i,
		'name': input_name,
		'type': input_type,
		'placeholder': placeholder
	}).appendTo(".input-zone" + i);
    }else {
    	$('<textarea>', {
		'class': "new-input" + i,
		'id': "textareaform",
		'name': input_name,
		'type': input_type,
		'placeholder': placeholder
	}).appendTo(".input-zone" + i);

    	$('</br>').appendTo(".input-zone" + i);

    	$('<p>', {
    		'class': "counter",
    		html: "/256"
    	}).appendTo(".input-zone" + i);

    	$('</br>').appendTo(".input-zone" + i);

    }

	if (i == "2") {
		$('<input>', {
		'class': "new-input" + i,
		'name': "newNameLast",
		'type': input_type,
		'placeholder': 'Last Name'	
		 }).appendTo(".input-zone" +i);

	} else if (i =="3") {
		$('<input>', {
		'class': "new-input" + i,
		'name': "newCountry",
		'type': input_type,
		'placeholder': 'country'
		 }).appendTo(".input-zone" + i);
	}
	
	$('<input>', {
		'class': "new-input-button" + i,
		'type': "submit",
		'value' : "Update"
	}).appendTo(".input-zone" + i);

	$('<input>', {
		'class': "new-input-cancel" + i,
		'type': "button",
		'value' : "cancel"
	}).appendTo(".input-zone" + i);

	
	$(".new-input-cancel"+ i).click(function(){
		
		disabledBox[i-1].className = "edit-disable";
		$("#newValueError" + i).html(" ");
		$(".edit-enable" + i).remove();
	});

	$(".new-input1").on("input", function(event) {
		
		if (event.target.value == $(".email-value").html()) {
			$("#newEmailError").html("New email address must be different from the previous one.");
			$(".new-input-button").attr("disabled", true);
		} else {
			$(".new-input-button").attr("disabled", false);
			$("#newEmailError").html(" ");
		}
	});

	$(".new-input2").on("input", function(event) {
		var usrRegex = new RegExp("^[a-zA-Z0-9äöüÄÖÜ]*$");
		if (usrRegex.test(event.target.value)) {
			$("#newNameError").html(" ")
			$(".new-input-button2").attr("disabled", false);
		} else {
			$("#newNameError").html("Special characters are not allowed.")
			$(".new-input-button2").attr("disabled", true);
		}
	});

	$(".new-input7").on("input", function(event){
		$(".counter").html(event.target.value.length + "/256");
		if (event.target.value.length <= 256){
			$("#newDescError").html( " ");
			$(".new-input-button7").attr("disabled", false);
		} else {
			$("#newDescError").html( "You have reached maximum number of characters!!");
			$(".new-input-button7").attr("disabled", true);
		}

	});


	
}


function processMenu(n, menu){
	for (i=0; i < menu.length; i++){
		menu[i].className = "main-nav-button";
	}
	
	menu[n-1].className += " selected";

}

function listInfo(n, info){
	for (i=0; i < info.length; i++){
		info[i].className = "profile-info";
	}
	if (n==1) {
		info[0].className += " selected";

		
	} else if (n==2){
		info[1].className += " selected";

	}
}

function loadCreateCalendarPage(){
	window.location.href = "users/createCalendar";
}
var name;
<<<<<<< HEAD
=======

function getMyCalendars(){

	$("#resultField").remove();
	$('<div>', {
		"id":"resultField"

	}).appendTo("#resultWrap");

	$('<ul>', {
		"class":"flt_l w50p",
		"id":"left_column"
	}).appendTo("#resultField");

	var email = $(".email-field").html();

	$.get("/users/getMyCalendars/" + email, function(result){

		for (i=0; i < result.length; i++){

			$('<li>', {
				"class": "fr-pro-wrap b_p_50",
				"id": "usr_" + i
			}).appendTo("#left_column");

			$('<form>', {
				"action": "calendars/" + result[i]._id,
				"id": "prof_" + i
			}).appendTo("#usr_" + i);

			$('<div>', {
				"class": "acc-info" ,
				"id": "acc" + i
			}).appendTo("#prof_" + i);
            //
			// $('<div>', {
			// 	"class": "resultcontain" ,
			// 	"id": "resultwrap" + i
			// }).appendTo("#acc" + i);

			$('<input>', {
				"class": "submitButton",
				"id": "submitButton_" + result[i]._id,
				// TODO: Find a way to display name of the calendar rather than the actual ID.
				"value": result[i].name

			}).appendTo("#acc" + i);
		}

		var submitButtons = document.getElementsByClassName("submitButton");

		for (i=0; i < submitButtons.length; i++){

			$("#submitButton_" + result[i]._id).click(function(event){
				
				window.location.href="/calendars/" + event.target.id.substring(13);
			});

		}


	});



}


>>>>>>> origin/master
