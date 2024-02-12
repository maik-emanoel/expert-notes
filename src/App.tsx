import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/NewNoteCard";
import { NoteCard } from "./components/NoteCard";
import { loadNotes, saveNotes } from "./utils/saveNotes";
import { toast } from "sonner";

export interface Note {
  id: string;
  title?: string;
  date: Date;
  content: string;
}

interface onNoteEditedProps {
  noteId: string;
  noteEdited: {
    editedTitle: string;
    editedContent: string;
  };
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(loadNotes());

  function onNoteCreated({
    title,
    content,
  }: {
    title: string | undefined;
    content: string;
  }) {
    const newNote = {
      id: crypto.randomUUID(),
      title,
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];
    setNotes(notesArray);
    saveNotes(notesArray);
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearch(query);
  }

  function onDeleteNote(noteId: string) {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  }

  function onNoteEdited({ noteId, noteEdited }: onNoteEditedProps) {
    const updatedNotes = notes.map((note) => {
      if (note.id === noteId) {
        return {
          ...note,
          title: noteEdited.editedTitle,
          content: noteEdited.editedContent,
        };
      }

      return note;
    });

    toast.success("Nota editada com sucesso!");
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) => {
          return (
            note.title
              ?.toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()) ||
            note.content
              ?.toLocaleLowerCase()
              .includes(search.toLocaleLowerCase())
          );
        })
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="Logo da NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
          value={search}
        />
      </form>

      <div className="h-px bg-slate-700"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => {
          return (
            <NoteCard
              key={note.id}
              note={note}
              onDeleteNote={() => onDeleteNote(note.id)}
              onNoteEdited={(noteId, noteEdited) =>
                onNoteEdited({ noteId, noteEdited })
              }
            />
          );
        })}
      </div>
    </div>
  );
}
