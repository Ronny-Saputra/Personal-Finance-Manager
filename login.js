function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    console.log("Email: " + email + " Password: " + password);
}

function goToSignUp() {
    window.location.href = 'signup.html'; // Redirects to Sign-Up Page
}
