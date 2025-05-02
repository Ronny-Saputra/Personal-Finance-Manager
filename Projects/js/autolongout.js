const IDLE_TIMEOUT = 600000;
    let idleTimer;

    function redirectToLogin() {
      window.location.href = "login.html";
    }

    function startIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(redirectToLogin, IDLE_TIMEOUT);
  }

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    startIdleTimer();
  }

  document.addEventListener("mousemove", resetIdleTimer);
  document.addEventListener("keydown", resetIdleTimer);
  document.addEventListener("click", resetIdleTimer);


  // Event listener untuk mendeteksi jika pengguna meninggalkan tab
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // Jika tab tidak aktif, langsung mulai timer idle
      startIdleTimer();
    } else {
      // Jika kembali ke tab, reset timer idle
      resetIdleTimer();
    }
  });

  startIdleTimer();