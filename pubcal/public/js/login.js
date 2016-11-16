// $(document).ready(() => {
//     $('#loginButton').click((event) => {
//         $('#popular').hide();
//         $('#popup').show();
//     });
//
//     $('#close').click((event) => {
//         $('#popup').hide();
//         $('#popular').show();
//     });
//
//     $('#signup').click((event) => {
//         $('#loginForm').hide();
//         $('#signupForm').show();
//     });
//
//     $('#login').click((event) => {
//         $('#signupForm').hide();
//         $('#loginForm').show();
//     });
// });
$(document).ready(function() {
    // $('#loginButton').click((event) => {
    //     $('#popular').hide();
    //     $('#popup').show();
    // });

    $('#close').click((event) => {
        $('#mask').hide();
        $('#login-box').hide();
    });

    $('#signup').click((event) => {
        $('#loginForm').hide();
        $('#signupForm').show();
    });

    $('#login').click((event) => {
        $('#signupForm').hide();
        $('#loginForm').show();
    });

    $('a.login-window').click(function() {

                //Getting the variable's value from a link
        var loginBox = $(this).attr('href');

        //Fade in the Popup
        $(loginBox).fadeIn(300);

        //Set the center alignment padding + border see css style
        var popMargTop = ($(loginBox).height() + 24) / 2;
        var popMargLeft = ($(loginBox).width() + 24) / 2;

        $(loginBox).css({
            'margin-top' : -popMargTop,
            'margin-left' : -popMargLeft
        });

        // Add the mask to body
        $('body').append('<div id="mask"></div>');
        $('#mask').fadeIn(300);

        return false;
    });

    // When clicking on the button close or the mask layer the popup closed

});
