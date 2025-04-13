document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        window.location.href = "login/login.html";
      }
    });
  }

  // Handle duration dropdown change
  const durationSelect = document.getElementById("duration-select");
  const durationDisplay = document.getElementById("duration-display");

  if (durationSelect && durationDisplay) {
    durationSelect.addEventListener("change", () => {
      const selected = durationSelect.value;
      durationDisplay.textContent = selected;
    });
  }
});


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
  