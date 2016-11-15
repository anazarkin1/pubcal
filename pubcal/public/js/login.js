$(document).ready(() => {
    $('#loginButton').click((event) => {
        $('#popular').hide();
        $('#popup').show();
    });

    $('#close').click((event) => {
        $('#popup').hide();
        $('#popular').show();
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
