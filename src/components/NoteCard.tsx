import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { useState } from "react";
import ShortcutButtonSave from "./ui/ShortCutButtonSave";

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

  const [open, setOpen] = useState(false);

  const noteEdited = {
    editedTitle,
    editedContent,
  };

  function handleSaveEditedNote() {
    if (!open) return

    onNoteEdited(note.id, noteEdited);
    setOpen(false);
    setIsEditing(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="flex flex-col rounded-md text-left bg-slate-800 p-5 gap-3 overflow-hidden outline-none relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <div className="w-full flex items-center gap-2 overflow-hidden">
          {note.title ? (
            <>
              <h2 className="font-medium whitespace-nowrap text-ellipsis overflow-hidden w-max">
                {note.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-slate-500 flex-shrink-0" />
                <span className="w-full text-xs font-medium text-slate-300 whitespace-nowrap flex-shrink-0 first-letter:uppercase">
                  {formatDistanceToNow(note.date, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </span>
              </div>
            </>
          ) : (
            <span className="text-sm font-medium text-slate-300 first-letter:uppercase">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
          )}
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

          <div className="flex flex-1 flex-col gap-3 p-5 pr-10">
            <div className="flex items-center gap-2 text-2xl font-medium">
            {note.title ? (
            <>
              <h2 className="font-medium whitespace-nowrap text-ellipsis overflow-hidden w-max">
                {note.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-slate-500 flex-shrink-0" />
                <span className="w-full text-xs font-medium text-slate-300 whitespace-nowrap flex-shrink-0 first-letter:uppercase">
                  {formatDistanceToNow(note.date, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </span>
              </div>
            </>
          ) : (
            <span className="text-sm font-medium text-slate-300 first-letter:uppercase">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
          )}
            </div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  id="title"
                  placeholder="Título"
                  className="bg-transparent outline-none"
                  value={editedTitle}
                  maxLength={32}
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

          <div className="flex items-center gap-4 p-2 flex-wrap md:flex-nowrap">
            {isEditing ? (
              <>
                <button
                  className="w-full border border-slate-200 py-4 text-center text-sm text-slate-200 outline-none font-medium rounded-md"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
                <button
                  className="w-full bg-slate-100 py-4 text-center text-sm text-slate-950 outline-none font-medium group rounded-md space-x-2"
                  onClick={handleSaveEditedNote}
                >
                  <span className="align-middle">Salvar</span>
                  <ShortcutButtonSave className="bg-slate-950 text-slate-100" onShortcutSave={handleSaveEditedNote}/>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onDeleteNote}
                  className="w-full py-4 text-center text-sm text-red-400 outline-none font-medium rounded-md border border-red-400 transition duration-200 hover:backdrop-brightness-75"
                >
                  Deseja apagar essa nota?
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-slate-300 py-4 text-center text-sm text-slate-950 outline-none font-medium rounded-md transition duration-200 hover:brightness-125"
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
