$(document).ready(function() {
    $(document).keydown((e) => {
        if (e.keyCode == 27) {
            $('#mask').hide();
            $('#menu-box').hide();
        }
    });

    $("body").click(() => {
        $('#mask').hide();
    $('#menu-box').hide();
    });

    $('#menu-box').click((e) => {
        e.stopPropagation();
    });

    $('#search-value').click(()=>{
        $("#search-value").val("");
    });

    $('a#menu-window').click(function() {

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
        $("#search-value").val("Click here to search...");
        $('#mask').fadeIn(300);


        return false;
    });
});

