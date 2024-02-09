import { Note } from "../App";

export function saveNotes(notes: Note[]) {
  return localStorage.setItem('notes', JSON.stringify(notes))
}

export function loadNotes() {
  const storedNotes = localStorage.getItem("notes");
  if (storedNotes !== null) {
    return JSON.parse(storedNotes);
  }

  return [];
}