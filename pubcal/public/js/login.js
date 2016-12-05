$(document).ready(function() {
    $(document).keydown((e) => {
        if (e.keyCode == 27) {
            $('#mask').hide();
            $('#login-box').hide();
        }
    });

    $("body").click(() => {
        $('#mask').hide();
        $('#login-box').hide();
    });

    $('#login-box').click((e) => {
        e.stopPropagation();
    });

    $('#signup').click(() => {
        $('#loginForm').hide();
        $('#signupForm').show();
        $('#login').addClass('w3-grey');
        $('#signup').removeClass('w3-grey');
    });

    $('#login').click(() => {
        $('#signupForm').hide();
        $('#loginForm').show();
        $('#signup').addClass('w3-grey');
        $('#login').removeClass('w3-grey');
    });

    $('a#login-window').click(function() {

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
});
