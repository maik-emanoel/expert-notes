import { useEffect } from "react";

interface ShortcutButtonSaveProps extends React.HTMLProps<HTMLSpanElement> {
  onShortcutSave: () => void
}

export default function ShortcutButtonSave({
  onShortcutSave,
  className,
  ...rest
}: ShortcutButtonSaveProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        onShortcutSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onShortcutSave]);

  return (
    <span
      className={`hidden bg-lime-950 text-lime-300 px-2 py-1 rounded-[4px] pointer-events-none text-[10px] md:inline ${className}`}
      {...rest}
    >
      CtrlK
    </span>
  );
}
