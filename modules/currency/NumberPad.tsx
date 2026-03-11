type Props = {
  numpadInput: (updater: (prev: string) => string) => void;
  setNumpad: React.Dispatch<React.SetStateAction<string>>;
  freshInputRef: React.RefObject<boolean>;
};

const KEYS = [
  "7", "8", "9",
  "4", "5", "6",
  "1", "2", "3",
] as const;

export default function NumberPad({ numpadInput, setNumpad, freshInputRef }: Props) {
  const handleDigit = (digit: string) => {
    numpadInput((prev) => (prev === "0" ? digit : prev + digit));
  };

  return (
    <div className="mt-4 pb-4">
      <div className="grid grid-cols-3 gap-1.5">
        {KEYS.map((key) => (
          <button
            key={key}
            className="p-3 font-semibold bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-700 active:bg-slate-100 dark:active:bg-zinc-600 active:scale-95 transition-all duration-150 rounded-xl text-xl text-slate-700 dark:text-slate-200 shadow-sm"
            onClick={() => handleDigit(key)}
          >
            {key}
          </button>
        ))}

        <button
          className="p-3 font-semibold bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-700 active:bg-slate-100 dark:active:bg-zinc-600 active:scale-95 transition-all duration-150 rounded-xl text-xl text-slate-700 dark:text-slate-200 shadow-sm"
          onClick={() => handleDigit("0")}
        >
          0
        </button>
        <button
          className="p-3 font-semibold bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-700 active:bg-slate-100 dark:active:bg-zinc-600 active:scale-95 transition-all duration-150 rounded-xl text-xl text-slate-700 dark:text-slate-200 shadow-sm"
          onClick={() =>
            numpadInput((prev) => (prev.includes(".") ? prev : prev + "."))
          }
        >
          .
        </button>

        <div className="flex gap-1.5">
          <button
            className="w-full p-3 font-semibold bg-slate-200/80 dark:bg-zinc-700/80 hover:bg-slate-300/80 dark:hover:bg-zinc-600/80 active:bg-slate-400/60 active:scale-95 transition-all duration-150 rounded-xl text-lg text-slate-600 dark:text-slate-300 shadow-sm"
            onClick={() =>
              numpadInput((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)))
            }
          >
            ←
          </button>

          <button
            className="w-full p-3 font-semibold bg-red-100/80 dark:bg-red-500/10 hover:bg-red-200/80 dark:hover:bg-red-500/20 active:bg-red-300/60 active:scale-95 transition-all duration-150 rounded-xl text-lg text-red-500 shadow-sm"
            onClick={() => {
              freshInputRef.current = false;
              setNumpad("0");
            }}
          >
            C
          </button>
        </div>
      </div>
    </div>
  );
}
