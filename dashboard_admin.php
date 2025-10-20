<?php
session_start();

// Zugriffskontrolle: Weiterleitung, wenn nicht eingeloggt
if (!isset($_SESSION['username']) || !isset($_SESSION['role']) || strtolower($_SESSION['role']) !== 'admin') {
    header('Location: login.html');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Admin Dashboard - International University of Mustercity</title>
  <link rel="icon" type="image/x-icon" href="assets/favicon_uni.ico" />
  <link rel="stylesheet" href="styles_uni.css" />
</head>
<body>
  <aside class="sidebar">
    <div class="logo">
      <img src="assets/LogoUniMusterstadt.png" alt="University Logo" style="width:100%; height:100%; object-fit:contain;">
    </div>
    <nav class="nav">
      <a href="index.html">Homepage</a>
      <a href="courses.html">Courses</a>
      <a href="research.html">Research</a>
      <a href="contact.html">Contact</a>
      <a href="login.html" id="userAreaLink">User Area</a>
    </nav>
  </aside>

  <div class="main">
    <header class="header">
      <nav class="main-nav">
        <div id="login-area">
          <a href="login.html" id="loginBtn" class="btn">Login</a>
        </div>
      </nav>
      <h1>International University of Mustercity</h1>
    </header>

    <main class="content dashboard-content" id="main-content">
      <!-- Dashboard-Inhalt wird dynamisch geladen -->
      <p>Loading dashboard...</p>
    </main>

    <footer class="footer">
      © 2025 International University of Mustercity | <a href="#">Imprint</a> | <a href="#">Privacy Policy</a>
    </footer>
  </div>

  <script src="scripts.js"></script>
  <script src="scripts_admin.js"></script>
  <script>
  // Var nicht deklarieren, sondern nur Wert setzen (Überschreiben)
  currentUser = {
    username: <?php echo json_encode($_SESSION['username']); ?>,
    role: <?php echo json_encode($_SESSION['role']); ?>
  };

  window.addEventListener("load", () => {
    if (currentUser && currentUser.username) {
      showAdminDashboard();
    } else {
      const contentElement = document.getElementById("main-content");
      contentElement.innerHTML = `<p>Access denied. Please log in as Admin.</p>`;
    }
  });
</script>

</body>
</html>
