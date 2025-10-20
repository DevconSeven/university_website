// ================================================================
// SECRETARIAT DASHBOARD
// ================================================================

function showSecretariatDashboard() {
  const contentElement = document.getElementById("main-content");
  if (!contentElement) return console.error("main-content not found");

  if (!currentUser || currentUser.role.toLowerCase() !== "secretariat") {
    contentElement.innerHTML = `<p>Access denied. Please log in as Secretariat.</p>`;
    return;
  }

  contentElement.innerHTML = `
    <div class="dashboard-content">
      <div class="dashboard">
        <h2>Secretariat Dashboard</h2>
        <p>Welcome <span class="username-highlight">${currentUser.username}</span></p>
        <div class="dashboard-buttons">
          <button onclick="showManagement('students')">Manage Students</button>
          <button onclick="showManagement('lecturers')">Manage Lecturers</button>
          <button onclick="logout()">Logout</button>
        </div>
        <div id="dashboard-content" style="margin-top:1em;"></div>
      </div>
    </div>
  `;
}

// ================================================================
// MANAGEMENT FOR STUDENTS & LECTURERS im SECRETARIAT DASHBOARD
// ================================================================

function showManagement(type) {
  const contentElement = document.getElementById("main-content");
  if (!contentElement) return console.error("main-content not found");

  contentElement.innerHTML = `
    <div class="textblock">
      <button class="back-btn" onclick="showSecretariatDashboard()">← Back</button>
      <h2>${type === 'students' ? 'Student Management' : 'Lecturer Management'}</h2>

      <div class="dashboard-buttons">
        <button onclick="showManagementView('${type}', 'form')">
          ➕ Add ${type === 'students' ? 'Student' : 'Lecturer'}
        </button>
        <button onclick="showManagementView('${type}', 'table')">
          📄 Show ${type === 'students' ? 'Student' : 'Lecturer'} Table
        </button>
        <button onclick="showManagementView('${type}', 'delete')">
          ❌ Delete ${type === 'students' ? 'Student' : 'Lecturer'}
        </button>
      </div>

      <div id="${type}Form" style="display:none; margin-top:1em;"></div>
      <div id="${type}Table" style="display:none; margin-top:1em;"></div>
      <div id="${type}Delete" style="display:none; margin-top:1em;"></div>

      <br><br>
      <button class="btn btn-logout" onclick="logout()">Logout</button>
    </div>
  `;
}

// ================================================================
// MANAGEMENT VIEW LOGIC
// ================================================================

function showManagementView(type, mode) {
  const formDiv = document.getElementById(`${type}Form`);
  const tableDiv = document.getElementById(`${type}Table`);
  const deleteDiv = document.getElementById(`${type}Delete`);

  if (!formDiv || !tableDiv || !deleteDiv) {
    console.error("One or more view containers not found for:", type);
    return;
  }

  // Zurücksetzen
  formDiv.style.display = "none";
  tableDiv.style.display = "none";
  deleteDiv.style.display = "none";

  if (mode === "form") {
    formDiv.style.display = "block";
    if (type === 'students') {
      formDiv.innerHTML = `
        <form id="studentForm" onsubmit="insertStudent(event)">
          <label for="student_id">Student ID</label>
          <input type="number" id="student_id" name="student_id" required>
          <label for="student_firstname">First Name</label>
          <input type="text" id="student_firstname" name="student_firstname" required>
          <label for="student_lastname">Last Name</label>
          <input type="text" id="student_lastname" name="student_lastname" required>
          <label for="student_age">Age</label>
          <input type="number" id="student_age" name="student_age" min="16" required>
          <label for="student_mail">Email</label>
          <input type="email" id="student_mail" name="student_mail" required>
          <label for="student_address">Address</label>
          <input type="text" id="student_address" name="student_address" required>
          <label for="subject_id">Subject ID</label>
          <input type="number" id="subject_id" name="subject_id" required>
          <button type="submit">Add Student</button>
        </form>
      `;
    } else {
      formDiv.innerHTML = `
        <form id="lecturerForm" onsubmit="insertLecturer(event)">
          <label for="lecturer_id">Lecturer ID</label>
          <input type="number" id="lecturer_id" name="lecturer_id" required>
          <label for="lecturer_firstname">First Name</label>
          <input type="text" id="lecturer_firstname" name="lecturer_firstname" required>
          <label for="lecturer_lastname">Last Name</label>
          <input type="text" id="lecturer_lastname" name="lecturer_lastname" required>
          <label for="entry_date">Entry Date</label>
          <input type="date" id="entry_date" name="entry_date" required>
          <label for="subject_id">Subject ID</label>
          <input type="number" id="subject_id" name="subject_id" required>
          <button type="submit">Add Lecturer</button>
        </form>
      `;
    }
  } else if (mode === "table") {
    tableDiv.style.display = "block";
    if (type === 'students') {
      fetchStudents();
    } else {
      fetchLecturers();
    }
  } else if (mode === "delete") {
    deleteDiv.style.display = "block";
    if (type === 'students') {
      deleteDiv.innerHTML = `
        <form class="delete-form" onsubmit="deleteStudent(event)">
          <label for="deleteMatnr">Student ID to delete:</label>
          <input type="number" id="deleteMatnr" name="deleteMatnr" required>
          <button type="submit">Delete Student</button>
        </form>
      `;
    } else {
      deleteDiv.innerHTML = `
        <form class="delete-form" onsubmit="deleteLecturer(event)">
          <label for="deleteEmpId">Employee ID to delete:</label>
          <input type="number" id="deleteEmpId" name="deleteEmpId" required>
          <button type="submit">Delete Lecturer</button>
        </form>
      `;
    }
  }
}

// ================================================================
// DATENHOLUNG: STUDENTEN UND DOZENTEN ANZEIGE
// ================================================================

function fetchStudents() {
  const tableDiv = document.getElementById("studentsTable");
  if (!tableDiv) {
    console.error("Div with ID 'studentsTable' not found.");
    return;
  }

  tableDiv.innerHTML = "Loading...";
  fetch("get_student.php")
    .then(response => {
      if (!response.ok) throw new Error("HTTP error " + response.status);
      return response.json();
    })
    .then(data => {
      let html = `<table>
        <thead><tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Age</th>
          <th style="min-width: 200px;">Email</th>
          <th style="min-width: 200px;">Address</th>
          <th>Subject</th>
        </tr></thead><tbody>`;

      data.forEach(student => {
        html += `<tr>
          <td>${student.student_id}</td>
          <td style="min-width: 120px;">${student.student_firstname}</td>
          <td style="min-width: 120px;">${student.student_lastname}</td>
          <td>${student.student_age}</td>
          <td style="min-width: 210px;">${student.student_mail}</td>
          <td style="min-width: 260px;">${student.student_address}</td>
          <td style="min-width: 150px;">${student.subject_name} (ID: ${student.subject_id})</td>
        </tr>`;
      });

      html += "</tbody></table>";
      tableDiv.innerHTML = html;
    })
    .catch(err => {
      tableDiv.innerHTML = `<p>Error loading student data.</p>`;
      console.error("Fetch student error:", err);
    });
}

function fetchLecturers() {
  const tableDiv = document.getElementById("lecturersTable");
  if (!tableDiv) {
    console.error("Div with ID 'lecturersTable' not found.");
    return;
  }

  tableDiv.innerHTML = "Loading...";
  fetch("get_lecturer.php")
    .then(response => {
      if (!response.ok) throw new Error("HTTP error " + response.status);
      return response.json();
    })
    .then(data => {
      let html = `<table>
        <thead><tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Entry Date</th>
          <th>Subject</th>
        </tr></thead><tbody>`;

      data.forEach(lecturer => {
        html += `<tr>
          <td>${lecturer.lecturer_id}</td>
          <td>${lecturer.lecturer_firstname}</td>
          <td>${lecturer.lecturer_lastname}</td>
          <td>${lecturer.entry_date}</td>
          <td>${lecturer.subject_name} (ID: ${lecturer.subject_id})</td>
        </tr>`;
      });

      html += "</tbody></table>";
      tableDiv.innerHTML = html;
    })
    .catch(err => {
      tableDiv.innerHTML = `<p>Error loading lecturer data.</p>`;
      console.error("Fetch lecturer error:", err);
    });
}

// ================================================================
// DATENMANIPULATION: STUDENTEN UND DOZENTEN HINZUFÜGEN/LÖSCHEN
// ================================================================

function insertStudent(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    student_id: form.student_id.value,
    student_firstname: form.student_firstname.value,
    student_lastname: form.student_lastname.value,
    student_age: parseInt(form.student_age.value),
    student_mail: form.student_mail.value,
    student_address: form.student_address.value,
    subject_id: parseInt(form.subject_id.value)
  };

  fetch("insert_student.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }).then(response => response.text())
    .then(text => {
      alert(text);
      showManagementView('students', 'table');
    }).catch(err => alert("Error inserting student: " + err));
}

function insertLecturer(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    lecturer_id: form.lecturer_id.value,
    lecturer_firstname: form.lecturer_firstname.value,
    lecturer_lastname: form.lecturer_lastname.value,
    entry_date: form.entry_date.value,
    subject_id: parseInt(form.subject_id.value)
  };

  fetch("insert_lecturer.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }).then(response => response.text())
    .then(text => {
      alert(text);
      showManagementView('lecturers', 'table');
    }).catch(err => alert("Error inserting lecturer: " + err));
}

function deleteStudent(event) {
  event.preventDefault();

  const input = document.getElementById("deleteMatnr");
  const id = input?.value?.trim();

  if (!id) {
    alert("Bitte eine gültige Student ID eingeben!");
    return;
  }

  fetch("delete_student.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: parseInt(id) })
  })
    .then(response => response.text())
    .then(text => {
      if (text.trim()) {
        alert(text);
      } else {
        alert("Keine Rückmeldung vom Server erhalten.");
      }
      showManagementView('students', 'table');
    })
    .catch(err => alert("Fehler beim Löschen des Studenten: " + err));
}

function deleteLecturer(event) {
  event.preventDefault();

  const input = document.getElementById("deleteEmpId");
  const id = input?.value?.trim();

  if (!id) {
    alert("Bitte eine gültige Lecturer ID eingeben!");
    return;
  }

  fetch("delete_lecturer.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lecturer_id: parseInt(id) })
  })
    .then(response => response.text())
    .then(text => {
      if (text.trim()) {
        alert(text);
      } else {
        alert("Keine Rückmeldung vom Server erhalten.");
      }
      showManagementView('lecturers', 'table');
    })
    .catch(err => alert("Fehler beim Löschen des Dozenten: " + err));
}