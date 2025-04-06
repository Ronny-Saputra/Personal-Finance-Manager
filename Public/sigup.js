window.signUp = async () => {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields!");
        return;
    }

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update displayName (full name)
        await updateProfile(user, {
            displayName: name
        });

        console.log("User registered:", user);
        alert("Sign Up Successful! Welcome, " + name);

        // Redirect to dashboard.html
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Error during sign up:", error);
        alert("Sign Up Failed: " + error.message);
    }
};