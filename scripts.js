// ================================================================
// LOGIN / LOGOUT AREA
// ================================================================

if (typeof currentUser === "undefined") {
  let currentUser = null;
}

// Login-Funktion
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  // Prüfen, dass alle Felder ausgefüllt sind
  if (!username || !password || !role) {
    alert("Please fill in all fields.");
    return;
  }

  fetch('login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role })
  })
  .then(res => res.text())  // erst mal als Text lesen
  .then(text => {
    console.log("Server response:", text); // Debug-Ausgabe
    try {
      const data = JSON.parse(text);
      if (data.success) {
        currentUser = { username, role: data.role };

        // **Sidebar-Link sofort aktualisieren**
        updateUserAreaLink();

        // Weiterleitung zum Dashboard
        window.location.href = getDashboardUrl(role);
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (e) {
      console.error("Error parsing JSON:", e);
      alert("Login error, check console for server response.");
    }
  })
  .catch(err => {
    console.error("Fetch error:", err);
    alert("An error occurred during login.");
  });
}

// Logout-Funktion
function logout() {
  fetch("logout.php", { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        currentUser = null;
        updateLoginButton();
        window.location.href = "login.html";
      } else {
        alert("Logout failed");
      }
    })
    .catch(err => console.error("Logout error:", err));
}

// Gibt das passende Dashboard zurück basierend auf Rolle
function getDashboardUrl(role) {
  switch(role.toLowerCase()) {
    case 'secretariat': return 'dashboard_secretariat.php';
    case 'admin': return 'dashboard_admin.php';
    case 'student': return 'dashboard_student.html';
    case 'lecturer': return 'dashboard_lecturer.html';
    default: return 'login.html';
  }
}

// Sidebar-Link dynamisch setzen
function updateUserAreaLink() {
  const link = document.getElementById("userAreaLink"); // ID in login.html
  if (!link) return;

  link.href = "login.html"; // Standard

  if (currentUser) {
    switch(currentUser.role.toLowerCase()) {
      case "admin":
        link.href = "dashboard_admin.php";
        break;
      case "secretariat":
        link.href = "dashboard_secretariat.php";
        break;
      case "student":
        link.href = "dashboard_student.php";
        break;
      case "lecturer":
        link.href = "dashboard_lecturer.php";
        break;
    }
  }
}

// Login-Bereich aktualisieren (Button oben rechts)
function updateLoginButton() {
  fetch("check_session.php", { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      const loginBtn = document.getElementById("loginBtn");
      if (!loginBtn) return;

      if (!data.loggedIn) {
        // Nicht eingeloggt
        loginBtn.textContent = "Login";
        loginBtn.href = "login.html";
        loginBtn.className = "btn";
        loginBtn.onclick = null;
      } else {
        // Eingeloggt
        loginBtn.textContent = "Logout";
        loginBtn.className = "btn btn-logout";
        loginBtn.href = "#";
        loginBtn.onclick = e => {
          e.preventDefault();
          fetch("logout.php", { credentials: "include" })
            .then(res => res.json())
            .then(() => {
              // Seite neu laden
              window.location.href = "login.html";
            })
            .catch(err => {
              if (err.name !== "AbortError") {
                console.error("Logout error:", err);
              }
            });
        };
      }
    })
    .catch(err => {
      if (err.name !== "AbortError") {
        console.error("Session check failed:", err);
      }
    });
}

window.addEventListener("load", updateLoginButton);


// Beim Laden der Seite
window.addEventListener("load", updateLoginButton);



// ================================================================
// USER REGISTRATION
// ================================================================
function register() {
    const usernameField = document.getElementById("regUsername");
    const passwordField = document.getElementById("regPassword");
    const password2Field = document.getElementById("regPassword2");
    const roleField = document.getElementById("registerRole");

    if (!usernameField || !passwordField || !password2Field || !roleField) {
        console.error("Register form elements not found");
        return;
    }

    const username = usernameField.value.trim();
    const password = passwordField.value.trim();
    const password2 = password2Field.value.trim();
    const role = roleField.value;

    // einfache Plausibilitätsprüfung
    if (!username || !password || !password2) {
        alert("Please fill out all fields.");
        return;
    }

    if (password !== password2) {
        alert("Passwords do not match.");
        return;
    }

    // Passwort-Check: mind. 6 Zeichen + Zahl oder Sonderzeichen
    const pwValid = password.length >= 6 && /[\d\W]/.test(password);
    if (!pwValid) {
        alert("Password must have at least 6 characters and include a number or special character.");
        return;
    }

    // Daten an PHP senden
    fetch("register_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Registration successful! Wait for confirmation by an administrator.");

            // Felder zurücksetzen
            usernameField.value = "";
            passwordField.value = "";
            password2Field.value = "";
            roleField.value = "student"; // optional Standardrolle zurücksetzen

            // zurück zum Login
            toggleRegisterForm();
        } else {
            alert("Registration failed: " + data.message);
        }
    })
    .catch(err => {
        console.error("Registration error:", err);
        alert("An error occurred during registration.");
    });
}

// Umschalten Login <-> Register
function toggleRegister() {
  const loginForm = document.getElementById("loginFormContainer");
  const registerForm = document.getElementById("registerFormContainer");
  const forgotForm = document.getElementById("forgotPasswordContainer");

  loginForm.style.display = (loginForm.style.display === "none") ? "block" : "none";
  registerForm.style.display = (registerForm.style.display === "none") ? "block" : "none";
  forgotForm.style.display = "none";
}

// Umschalten Login <-> Forgot Password
function toggleForgotPassword() {
  const loginForm = document.getElementById("loginFormContainer");
  const forgotForm = document.getElementById("forgotPasswordContainer");
  const registerForm = document.getElementById("registerFormContainer");

  if (forgotForm.style.display === "none") {
    loginForm.style.display = "none";
    forgotForm.style.display = "block";
    registerForm.style.display = "none";
  } else {
    forgotForm.style.display = "none";
    loginForm.style.display = "block";
  }
}

// Passwort ein-/ausblenden
function togglePassword(fieldId, button) {
  const input = document.getElementById(fieldId);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  button.textContent = isPassword ? "🙈" : "👁";
}

// Passwort-Reset anfordern
function requestPasswordReset() {
  const username = document.getElementById("forgot_username").value.trim();
  if (!username) {
    alert("Please enter your username.");
    return;
  }

  fetch("request_password_reset.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error("Password reset error:", err));
}