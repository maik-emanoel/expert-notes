import { ChangeEvent, useEffect, useRef, useState } from "react";
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
  const inputSearchRef = useRef<null | HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false)

  useEffect(() => {
    handleFocusInput();
    return () => handleFocusInput();
  }, []);

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

  function handleFocusInput() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "/" && inputSearchRef.current) {
        e.preventDefault();
        inputSearchRef.current.focus();
      }

      return;
    });
  }

  console.log(isInputFocused)

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

      <form className="w-full relative">
        <input
          type="text"
          ref={inputSearchRef}
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
          value={search}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        <span className="hidden absolute top-1/2 -translate-y-1/2 right-6 border border-slate-600 px-2 rounded-[4px] text-slate-300 pointer-events-none md:block">
          /
        </span>
      </form>

      <div className={`h-px ${isInputFocused ? 'bg-slate-500' : 'bg-slate-700'}`} />

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
