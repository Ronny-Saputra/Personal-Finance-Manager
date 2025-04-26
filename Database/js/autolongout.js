let timeout;
const INACTIVITY_LIMIT = 10 * 60 * 1000; // 5 menit

function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    logoutUser();
  }, INACTIVITY_LIMIT);
}

function logoutUser() {
  firebase.auth().signOut().then(() => {
    console.log("User signed out due to inactivity");
    window.location.href = "login.html";
  });
}

window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeypress = resetTimer;
document.onclick = resetTimer;
document.onscroll = resetTimer;
