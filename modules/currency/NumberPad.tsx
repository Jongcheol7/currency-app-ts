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
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
            onClick={() => handleDigit(key)}
          >
            {key}
          </button>
        ))}

        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => handleDigit("0")}
        >
          0
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() =>
            numpadInput((prev) => (prev.includes(".") ? prev : prev + "."))
          }
        >
          .
        </button>

        <div className="flex gap-1">
          <button
            className="w-full p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
            onClick={() =>
              numpadInput((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)))
            }
          >
            ←
          </button>

          <button
            className="w-full p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
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
