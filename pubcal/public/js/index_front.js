$(document).ready(() => {
    // $('#popup').hide();
    $('#loginButton').click((event) => {
        $('#popup').show();
    });

    $('#close').click((event) => {
        $('#popup').hide();
    });

    $('#signup').click((event) => {
        $('#loginForm').hide();
        $('#signupForm').show();
    });

    $('#login').click((event) => {
        $('#signupForm').hide();
        $('#loginForm').show();
    });
});
