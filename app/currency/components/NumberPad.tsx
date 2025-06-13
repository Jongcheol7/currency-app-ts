import { evaluate } from "mathjs";
import { useState } from "react";

type Props = {
  setCalculatedAmt: (val: number) => void;
};
export default function NumberPad({ setCalculatedAmt }: Props) {
  const [calc, setCalc] = useState("");
  return (
    <div>
      <input
        className="bg-white w-full rounded-md p-1 px-2 mb-2"
        value={calc}
        readOnly
      />
      <div className="grid grid-cols-4 gap-2">
        <button
          className="p-3 text-red-600 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc("")}
        >
          C
        </button>
        <button
          className="p-3 text-blue-600 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "(")}
        >
          （
        </button>
        <button
          className="p-3 text-blue-600 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + ")")}
        >
          ）
        </button>
        <button
          className="p-3 text-green-600 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "/")}
        >
          /
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "7")}
        >
          7
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "8")}
        >
          8
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "9")}
        >
          9
        </button>
        <button
          className="p-3 text-green-600 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "X")}
        >
          ×
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "4")}
        >
          4
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "5")}
        >
          5
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "6")}
        >
          6
        </button>
        <button
          className="p-3 text-green-600 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "-")}
        >
          -
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "1")}
        >
          1
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "2")}
        >
          2
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "3")}
        >
          3
        </button>
        <button
          className="p-3 text-green-600 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "+")}
        >
          +
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + "0")}
        >
          0
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc + ".")}
        >
          .
        </button>
        <button
          className="p-3 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => setCalc(calc.substring(0, calc.length - 1))}
        >
          ←
        </button>
        <button
          className="p-3 text-green-600 font-bold bg-white hover:bg-gray-100 transition-all rounded-2xl text-2xl"
          onClick={() => {
            const result = evaluate(calc.replace(/X/g, "*"));
            setCalc("");
            setCalculatedAmt(result);
          }}
        >
          =
        </button>
      </div>
    </div>
  );
}
