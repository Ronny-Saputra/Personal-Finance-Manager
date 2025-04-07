// Import Firebase SDK
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

// Function for Email & Password Login with Validation
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validasi input
    if (!email || !password) {
        alert("Email dan password harus diisi!");
        return;
    }

    // Loading indicator (opsional)
    const button = document.querySelector("button");
    button.disabled = true;
    button.textContent = "Loading...";

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        alert("Login berhasil!");
        button.disabled = false;
        button.textContent = "Submit";
        console.log("Redirecting ke dashboard..."); // ✅ Tambahkan di sini
        window.location.replace('/dashboard.html');
    })
        .catch((error) => {
            button.disabled = false; // Kembalikan tombol ke state awal
            button.textContent = "Submit";

            if (error.code === "auth/wrong-password") {
                alert("Password salah!");

                // Feedback visual: Ubah warna input jadi merah
                const passwordInput = document.getElementById('password');
                passwordInput.style.borderColor = "red";

                // Feedback visual: Tambah efek getaran
                const loginForm = document.getElementById('loginForm');
                loginForm.classList.add("shake");

                // Hilangkan efek getaran setelah 0.5 detik
                setTimeout(() => loginForm.classList.remove("shake"), 500);

                // Inline CSS untuk efek getaran
                if (!document.getElementById('shakeStyle')) {
                    const style = document.createElement('style');
                    style.id = 'shakeStyle';
                    style.innerHTML = `
                        @keyframes shake {
                            0%, 100% { transform: translateX(0); }
                            25% { transform: translateX(-10px); }
                            75% { transform: translateX(10px); }
                        }
                        .shake {
                            animation: shake 0.5s;
                        }
                    `;
                    document.head.appendChild(style);
                }
            } else if (error.code === "auth/user-not-found") {
                alert("User tidak ditemukan! Silakan daftar terlebih dahulu.");
            } else {
                alert("Login gagal! " + error.message);
            }
        });
}

// Function for Forgot Password
function forgotPassword() {
    const email = prompt("Masukkan email kamu:");
    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Link reset password sudah dikirim ke email kamu!");
            })
            .catch((error) => {
                console.error("Gagal mengirim link reset password:", error.message);
                alert("Gagal mengirim link reset password: " + error.message);
            });
    }
}

// Function to Redirect to Sign-Up Page
function goToSignUp() {
    window.location.href = 'signup.html'; // Redirects to Sign-Up Page
}

// Export Functions (if needed)
export { login, forgotPassword, goToSignUp };