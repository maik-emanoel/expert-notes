import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import ShortcutButtonSave from "./ui/ShortCutButtonSave";

interface NewNoteCardProps {
  onNoteCreated: ({
    title,
    content,
  }: {
    title: string | undefined;
    content: string;
  }) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [open, setOpen] = useState(false);

  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  function handleTitleChanged(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleContentChanged(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);

    if (e.target.value === "") {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(e: FormEvent) {
    e.preventDefault();
    if (content === "") return;

    onNoteCreated({ title, content });
    toast.success("Nota criada com sucesso!");
    setTitle("");
    setContent("");
    setShouldShowOnboarding(true);
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta a API de gravação!");
      return;
    }

    setIsRecording(true);
    setShouldShowOnboarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  function handleShortcutSave() {
    if (content === "" || !open) return;

    onNoteCreated({ title, content });
    toast.success("Nota criada com sucesso!");
    setTitle("");
    setContent("");
    setShouldShowOnboarding(true);
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="rounded-md bg-slate-700 p-5 flex flex-col gap-3 text-left outline-none hover:ring-2 hover:ring-slate-400 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.DialogOverlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-screen md:max-w-[640px] md:h-[60vh] md:rounded-md bg-slate-700 flex flex-col outline-none overflow-hidden">
          <Dialog.Close className="absolute right-4 top-4 bg-slate-800 text-slate-400 rounded-full p-1 hover:text-slate-100">
            <X size={20} />
          </Dialog.Close>

          <form className="h-full flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-2xl font-medium text-slate-300">
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    className="font-medium text-lime-400 hover:underline"
                    type="button"
                    onClick={handleStartRecording}
                  >
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    className="font-medium text-lime-400 hover:underline"
                    type="button"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <>
                  <input
                    type="text"
                    id="title"
                    placeholder="Título"
                    className="bg-transparent outline-none"
                    value={title}
                    maxLength={32}
                    onChange={handleTitleChanged}
                  />

                  <textarea
                    autoFocus
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none textarea-scrollbar"
                    placeholder="Insira sua nota..."
                    onChange={handleContentChanged}
                    value={content}
                  />
                </>
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (Clique p/ interromper)
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  handleSaveNote(e);
                  setOpen(false);
                }}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium space-x-2 hover:bg-lime-500"
              >
                <span className="align-middle">Salvar nota</span>
                <ShortcutButtonSave onShortcutSave={handleShortcutSave} />
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
