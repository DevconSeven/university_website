// ================================================================
// ADMIN DASHBOARD FUNCTIONS
// ================================================================

// Zeigt das Admin Dashboard mit Auswahl zwischen Pending Users und Users
function showAdminDashboard() {
  const contentElement = document.getElementById("main-content");
  if (!contentElement) return console.error("main-content not found");

  contentElement.innerHTML = `
    <div class="dashboard-content">
      <div class="dashboard">
        <h2>Admin Dashboard</h2>
        <p>Welcome <span class="username-highlight">${currentUser.username}</span></p>
        <div class="dashboard-buttons">
          <button onclick="showPendingUsers()">Manage Pending Users</button>
          <button onclick="showUsers()">Manage Users</button>
          <button onclick="logout()">Logout</button>
        </div>
        <div id="dashboard-content" style="margin-top:1em;"></div>
      </div>
    </div>
  `;
}


// -----------------------------
// Pending Users
// -----------------------------
function showPendingUsers() {
  const contentElement = document.getElementById("dashboard-content");
  if (!contentElement) return console.error("dashboard-content not found");

  contentElement.innerHTML = `
    <div class="textblock">
      <button class="back-btn" onclick="showAdminDashboard()">← Back</button>
      <h2>Pending Users</h2>
      <div id="pendingUsersTable" style="margin-top:1em;"></div>
    </div>
  `;

  const tableDiv = document.getElementById("pendingUsersTable");
  tableDiv.innerHTML = "Loading...";

  fetch("get_pending_users.php")
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        tableDiv.innerHTML = "<p>No pending users.</p>";
        return;
      }

      let html = `<table>
        <thead><tr>
          <th>Username</th>
          <th>Role</th>
          <th>Actions</th>
        </tr></thead><tbody>`;

      data.forEach(user => {
        html += `<tr>
          <td>${user.username}</td>
          <td>${user.role}</td>
          <td>
            <button onclick="approvePendingUser('${user.username}', ${user.role_id})">✅ Approve</button>
            <button onclick="rejectPendingUser('${user.username}')">❌ Reject</button>
          </td>
        </tr>`;
      });

      html += "</tbody></table>";
      tableDiv.innerHTML = html;
    })
    .catch(err => {
      console.error("Fetch pending users error:", err);
      tableDiv.innerHTML = "<p>Error loading pending users.</p>";
    });
}


// -----------------------------
// Active Users
// -----------------------------
function showUsers() {
  const contentElement = document.getElementById("dashboard-content");
  if (!contentElement) return console.error("dashboard-content not found");

  contentElement.innerHTML = `
    <div class="textblock">
      <button class="back-btn" onclick="showAdminDashboard()">← Back</button>
      <h2>User Management</h2>
      <div id="usersTable" style="margin-top:1em;"></div>
    </div>
  `;

  const tableDiv = document.getElementById("usersTable");
  tableDiv.innerHTML = "Loading...";

  fetch("get_users.php")
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        tableDiv.innerHTML = "<p>No users.</p>";
        return;
      }

      let html = `<table>
        <thead><tr>
          <th>ID</th>
          <th>Username</th>
          <th>Role</th>
          <th>Change Role</th>
          <th>Active</th>
        </tr></thead><tbody>`;

      data.forEach(user => {
        html += `<tr>
          <td>${user.user_id}</td>
          <td>${user.username}</td>
          <td>${user.role_name}</td>
          <td>
            <select onchange="changeUserRole(${user.user_id}, this.value)">
              <option value="">-- select role --</option>
              <option value="1" ${user.role_name.toLowerCase() === 'admin' ? 'selected' : ''}>Admin</option>
              <option value="2" ${user.role_name.toLowerCase() === 'secretariat' ? 'selected' : ''}>Secretariat</option>
              <option value="3" ${user.role_name.toLowerCase() === 'lecturer' ? 'selected' : ''}>Lecturer</option>
              <option value="4" ${user.role_name.toLowerCase() === 'student' ? 'selected' : ''}>Student</option>
            </select>
          </td>
          <td>
            <button onclick="changeUserActive(${user.user_id}, ${user.active ? 0 : 1})">
              ${user.active ? "Deactivate" : "Activate"}
            </button>
          </td>
        </tr>`;
      });

      html += "</tbody></table>";
      tableDiv.innerHTML = html;
    })
    .catch(err => {
      console.error("Fetch users error:", err);
      tableDiv.innerHTML = "<p>Error loading users.</p>";
    });
}



// ------------------------------------------
// Pending User freischalten
// ------------------------------------------
function approvePendingUser(username, role_id) {
  fetch("approve_pending_user.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, role_id: parseInt(role_id) })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    showPendingUsers(); // Tabelle aktualisieren
  })
  .catch(err => {
    console.error("Approve pending user error:", err);
    alert("Error approving user.");
  });
}

// ------------------------------------------
// Pending User ablehnen / löschen
// ------------------------------------------
function rejectPendingUser(username) {
  if (!confirm(`Are you sure you want to reject user "${username}"?`)) return;

  fetch("reject_pending_user.php", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ username })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    showPendingUsers(); // Tabelle aktualisieren
  })
  .catch(err => {
    console.error("Reject pending user error:", err);
    alert("Error rejecting user.");
  });
}

// ------------------------------------------
// Rolle eines bestehenden Users ändern
// ------------------------------------------
function changeUserRole(userId, roleId) {
  if (!roleId) return; // kein leeres Feld zulassen

  fetch("change_user_role.php", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ user_id: userId, role_id: parseInt(roleId) })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    showUsers(); // Tabelle aktualisieren
  })
  .catch(err => {
    console.error("Change role error:", err);
    alert("Error changing role.");
  });
}
// ------------------------------------------
// Aktiv/Inaktiv Status eines Users ändern
// ------------------------------------------
function changeUserActive(userId, active) {
  fetch("change_user_active.php", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ user_id: userId, active: parseInt(active) })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    showUsers(); // Tabelle aktualisieren
  })
  .catch(err => {
    console.error("Change active status error:", err);
    alert("Error changing active status.");
  });
}