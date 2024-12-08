const API_URL = "http://localhost:3000/notes";
const notesContainer = document.getElementById("notes");
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

let isEditing = false;
let currentEditId = null;

async function fetchNotes() {
  try {
    const response = await fetch(API_URL);
    const notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    console.error("Notlar yüklenirken bir hata oluştu:", error);
  }
}

function renderNotes(notes) {
  notesContainer.innerHTML = `
    <div class="mb-4">
      <h2>Tamamlanmamış Notlar</h2>
      <div id="incompleteNotes" class="row g-3"></div>
    </div>
    <div>
      <h2>Tamamlanmış Notlar</h2>
      <div id="completedNotes" class="row g-3"></div>
    </div>
  `;

  const incompleteNotes = document.getElementById("incompleteNotes");
  const completedNotes = document.getElementById("completedNotes");

  for (const id in notes) {
    const note = notes[id];
    const noteCard = `
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-body">
            <h5 class="card-title">${note.title}</h5>
            <p class="card-text">${note.content}</p>
            <button class="btn btn-sm ${
              note.completed ? "btn-secondary" : "btn-success"
            }" onclick="noteCompletion('${id}')">
              ${note.completed ? "Geri Al" : "Tamamla"}
            </button>
            <button class="btn btn-warning btn-sm" onclick="startEdit('${id}', '${
      note.title
    }', '${note.content}')">
              Düzenle
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteNote('${id}')">Sil</button>
          </div>
        </div>
      </div>
    `;

    if (note.completed) {
      completedNotes.insertAdjacentHTML("beforeend", noteCard);
    } else {
      incompleteNotes.insertAdjacentHTML("beforeend", noteCard);
    }
  }
}

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const noteData = {
    title: titleInput.value,
    content: contentInput.value,
  };

  if (isEditing) {
    try {
      await fetch(`${API_URL}/${currentEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Not güncellenirken bir hata oluştu:", error);
    }
  } else {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Not eklenirken bir hata oluştu:", error);
    }
  }
});

function startEdit(id, title, content) {
  isEditing = true;
  currentEditId = id;
  titleInput.value = title;
  contentInput.value = content;
  document.querySelector("button[type='submit']").innerText = "Güncelle";
}

function resetForm() {
  isEditing = false;
  currentEditId = null;
  titleInput.value = "";
  contentInput.value = "";
  document.querySelector("button[type='submit']").innerText = "Not Ekle";
}

async function deleteNote(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchNotes();
  } catch (error) {
    console.error("Not silinirken bir hata oluştu:", error);
  }
}
async function noteCompletion(id) {
  try {
    const response = await fetch(`${API_URL}/${id}/toggle`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error(`Hata: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result.message);
    fetchNotes();
  } catch (error) {
    console.error("Not durumu değiştirilemedi:", error.message);
  }
}

fetchNotes();
