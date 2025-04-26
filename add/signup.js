const checkPasswordStrength = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 8) {
        return { message: "Too short (min. 8 characters)", level: "weak" };
    }

    if (hasLetter && hasNumber && hasSymbol) {
        return { message: "Strong password", level: "strong" };
    }

    if ((hasLetter && hasNumber) || (hasLetter && hasSymbol) || (hasNumber && hasSymbol)) {
        return { message: "Moderate password. Add more variation!", level: "moderate" };
    }

    return { message: "Weak password. Use letters, numbers, and symbols.", level: "weak" };
};

document.getElementById("password").addEventListener("input", (e) => {
    const { message, level } = checkPasswordStrength(e.target.value);
    const strengthEl = document.getElementById("password-strength");

    strengthEl.textContent = message;
    strengthEl.style.color = level === "strong" ? "green" : level === "moderate" ? "orange" : "red";
});


// Add event listener to password input
document.getElementById('password').addEventListener('input', () => {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('password-strength');

    const { message, level } = checkPasswordStrength(password);

    strengthIndicator.textContent = message;

    if (level === "strong") {
        strengthIndicator.style.color = "green";
    } else if (level === "moderate") {
        strengthIndicator.style.color = "orange";
    } else {
        strengthIndicator.style.color = "red";
    }
});

window.signUp = async () => {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields!");
        return;
    }

    const { level } = checkPasswordStrength(password);
if (level === "weak") {
    alert("Please use a stronger password!");
    return;
}


    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: name
        });

        console.log("User registered:", user);
        alert("Sign Up Successful! Welcome, " + name);

        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Error during sign up:", error);
        alert("Sign Up Failed: " + error.message);
    }
};