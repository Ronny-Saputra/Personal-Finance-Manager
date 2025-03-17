function signup() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    
    console.log("Name: " + name + " Email: " + email + " Password: " + password);
}

function goToLogin() {
    window.location.href = 'login.html'; // Redirects to Login Page
}
