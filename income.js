document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-button");
  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (confirmLogout) {
          window.location.href = "login.html";
        }
      });
    }
  });
  