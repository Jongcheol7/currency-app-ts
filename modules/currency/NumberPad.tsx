type Props = {
  setNumpad: React.Dispatch<React.SetStateAction<string>>;
};

export default function NumberPad({ setNumpad }: Props) {
  return (
    <div className="mt-2">
      <div className="grid grid-cols-3 gap-2">
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setNumpad((prev) => (prev === "0" ? "7" : prev + "7"))}
        >
          7
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setNumpad((prev) => (prev === "0" ? "8" : prev + "8"))}
        >
          8
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setNumpad((prev) => (prev === "0" ? "9" : prev + "9"))}
        >
          9
        </button>

        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setNumpad((prev) => (prev === "0" ? "4" : prev + "4"))}
        >
          4
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setNumpad((prev) => (prev === "0" ? "5" : prev + "5"))}
        >
          5
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setNumpad((prev) => (prev === "0" ? "6" : prev + "6"))}
        >
          6
        </button>

        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setNumpad((prev) => (prev === "0" ? "1" : prev + "1"))}
        >
          1
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setNumpad((prev) => (prev === "0" ? "2" : prev + "2"))}
        >
          2
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setNumpad((prev) => (prev === "0" ? "3" : prev + "3"))}
        >
          3
        </button>

        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setNumpad((prev) => (prev === "0" ? "0" : prev + "0"))}
        >
          0
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() =>
            setNumpad((prev) => (prev.includes(".") ? prev : prev + "."))
          }
        >
          .
        </button>

        <div className="flex gap-1">
          <button
            className="w-full p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
            onClick={() =>
              setNumpad((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)))
            }
          >
            ←
          </button>

          <button
            className="w-full p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
            onClick={() => setNumpad("0")}
          >
            C
          </button>
        </div>
      </div>
    </div>
  );
}
