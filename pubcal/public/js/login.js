$(document).ready(function() {
    $('#close').click((event) => {
        $('#mask').hide();
        $('#login-box').hide();
    });

    $(document).keydown((e) => {
        if (e.keyCode == 27) {
            $('#mask').hide();
            $('#login-box').hide();
        }
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
});
