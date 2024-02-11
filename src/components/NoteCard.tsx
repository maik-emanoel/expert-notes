import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { useState } from "react";

interface NoteCardProps {
  note: {
    id: string;
    title?: string;
    date: Date;
    content: string;
  };
  onDeleteNote: () => void;
  onNoteEdited: (
    noteId: string,
    noteEdited: { editedTitle: string; editedContent: string }
  ) => void;
}

export function NoteCard({ note, onDeleteNote, onNoteEdited }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title || "");
  const [editedContent, setEditedContent] = useState(note.content);

  const noteEdited = {
    editedTitle,
    editedContent,
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex flex-col rounded-md text-left bg-slate-800 p-5 gap-3 overflow-hidden outline-none relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <div className="flex items-center gap-2">
          {note.title && (
            <>
              <h2 className="font-medium">{note.title}</h2>
              <span className="size-1 rounded-full bg-slate-500" />
            </>
          )}
          <span className="text-sm font-medium text-slate-300 first-letter:uppercase">
            {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-400">{note.content}</p>

        <div className="absolute left-0 bottom-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.DialogOverlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-screen md:max-w-[640px] md:h-[60vh] md:rounded-md bg-slate-700 flex flex-col outline-none overflow-hidden">
          <Dialog.Close className="absolute right-2 top-2 bg-slate-800 text-slate-400 rounded-full p-1 hover:text-slate-100">
            <X size={20} />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-center gap-2 text-2xl font-medium">
              {note.title && (
                <>
                  <h2>{note.title}</h2>
                  <span className="size-1 rounded-full bg-slate-500" />
                </>
              )}
              <span className="text-sm font-medium text-slate-300 first-letter:uppercase">
                {formatDistanceToNow(note.date, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </span>
            </div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  id="title"
                  placeholder="Título"
                  className="bg-transparent outline-none"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />

                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none textarea-scrollbar"
                  placeholder="Insira sua nota..."
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </>
            ) : (
              <p className="text-sm leading-6 text-slate-400">{note.content}</p>
            )}
          </div>

          <div className="flex items-center gap-4 p-2">
            {isEditing ? (
              <button
                className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group rounded-md"
                onClick={() => onNoteEdited(note.id, noteEdited)}
              >
                Salvar
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onDeleteNote}
                  className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group rounded-md"
                >
                  Deseja{" "}
                  <span className="text-red-400 group-hover:underline">
                    apagar essa nota
                  </span>
                  ?
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-slate-300 py-4 text-center text-sm text-slate-950 outline-none font-medium rounded-md"
                >
                  Editar nota
                </button>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
