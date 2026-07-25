// DOM variables
const addButton = document.getElementById("addButton");
const noteInput = document.getElementById("noteInput");
const notesContainer = document.getElementById("notes");

// data
const STORAGE_KEY = "notes";
const STORAGE_VERSION = 1;
let notes = [];

// base
noteInput.focus();

// functions
function addNote() {
  const inputText = getInputValue();

  if (inputText === "") {
    return;
  }

  addNoteToArray(inputText);
  renderNotes();
  clearNoteInput();
  updateButtonState();
}

function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);

  if (!savedNotes) {
    return;
  }

  try {
    const storageData = JSON.parse(savedNotes);

    if (
      storageData.version !== STORAGE_VERSION ||
      !Array.isArray(storageData.notes)
    ) {
      resetStorage();
      return;
    }

    notes = storageData.notes;
  } catch (error) {
    console.error("Failed to load notes from LocalStorage:", error);

    resetStorage();
  }
}

function resetStorage() {
  notes = [];
  saveNotes();
}

function getInputValue() {
  return noteInput.value.trim();
}

function getEditInputValue(editInput) {
  return editInput.value.trim();
}

function updateButtonState() {
  addButton.disabled = getInputValue() === "";
}

function addNoteToArray(inputText) {
  notes.push(new Note(inputText));
  saveNotes();
}

function Note(inputText) {
  this.id = crypto.randomUUID();
  this.text = inputText;
  this.createdAt = new Date().toISOString();
}

function saveNotes() {
  const storageData = {
    version: STORAGE_VERSION,
    notes: notes
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
}

function renderNotes() {
  notesContainer.innerHTML = "";

  notes.forEach(function (note) {
    createNote(note);
  });

  noteInput.focus();
}

function createNote(note) {
  const noteDiv = document.createElement("div");
  const noteParagraph = document.createElement("p");
  const editIcon = document.createElement("img");
  const editButton = document.createElement("button");
  const deleteIcon = document.createElement("img");
  const deleteButton = document.createElement("button");

  noteDiv.dataset.id = note.id;
  noteDiv.classList.add("note");

  noteParagraph.textContent = note.text;
  noteParagraph.classList.add("note-text");

  editIcon.src = "assets/edit.svg";
  editIcon.alt = "Edit icon";
  editButton.classList.add("edit-btn");

  editButton.dataset.noteId = note.id;
  editButton.append(editIcon);
  editButton.addEventListener("click", (event) => {
    const noteId = event.currentTarget.dataset.noteId;
    const noteElement = document.querySelector(`div[data-id="${noteId}"]`);

    const editInput = noteElement.querySelector("input");

    if (!editInput) {
      editNote(noteId);
    } else {
      saveNote(noteId);
      saveNotes();
    }
  });

  deleteIcon.src = "assets/delete.svg";
  deleteIcon.alt = "Delete icon";
  deleteButton.classList.add("delete-btn");

  deleteButton.dataset.noteId = note.id;
  deleteButton.append(deleteIcon);
  deleteButton.addEventListener("click", (event) => {
    const noteId = event.currentTarget.dataset.noteId;

    deleteNote(noteId);
  });

  noteDiv.append(noteParagraph, editButton, deleteButton);

  notesContainer.prepend(noteDiv);
}

function editNote(noteId) {
  const index = notes.findIndex((note) => note.id === noteId);
  const noteElement = document.querySelector(`div[data-id="${noteId}"]`);

  if (index === -1) {
    return console.log("There is no note found with id " + noteId);
  }

  const note = notes[index];
  const paragraph = noteElement.querySelector("p");
  const editButton = noteElement.querySelector(".edit-btn");

  const editInput = document.createElement("input");
  const saveIcon = document.createElement("img");

  editInput.type = "text";
  editInput.value = note.text;
  editInput.dataset.noteId = noteId;

  paragraph.replaceWith(editInput);
  editInput.focus();
  editInput.addEventListener("keydown", (event) => {
    const noteId = event.currentTarget.dataset.noteId;

    if (event.key === "Enter") {
      event.preventDefault();
      saveNote(noteId);
    } else if (event.key === "Escape") {
      event.preventDefault();
      renderNotes();
    }
  });

  saveIcon.src = "assets/arrow-right.svg";
  saveIcon.alt = "Save icon";

  editButton.replaceChildren(saveIcon);
}

function saveNote(noteId) {
  const note = notes.find((note) => note.id === noteId);

  if (!note) {
    return console.log("There is no note found with id " + noteId);
  }

  const editInput = document.querySelector(`input[data-note-id="${noteId}"]`);

  const newText = getEditInputValue(editInput);

  if (newText === "") {
    return;
  }

  note.text = newText;

  saveNotes();
  renderNotes();
}

function deleteNote(noteId) {
  const index = notes.findIndex((note) => note.id === noteId);

  if (index === -1) {
    return console.log("There is no note found with id " + noteId);
  }
  
  notes.splice(index, 1);
  saveNotes();
  renderNotes();
}

function clearNoteInput() {
  noteInput.value = "";
}

// eventlisteners
addButton.addEventListener("click", () => {
  addNote();
});

noteInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addNote();
  }
});

noteInput.addEventListener("input", () => {
  updateButtonState();
});

// initial load
loadNotes();
renderNotes();
updateButtonState();