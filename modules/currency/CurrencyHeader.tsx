"use client";
import PostRatesButton from "./PostRateButton";

type Props = {
  updatedDate: Date;
  cardCount: number;
  onCardCountChange: (count: 2 | 4 | 6) => void;
};

const CARD_COUNTS = [2, 4, 6] as const;

export default function CurrencyHeader({
  updatedDate,
  cardCount,
  onCardCountChange,
}: Props) {
  return (
    <div className="flex justify-between items-center mt-2">
      <p className="font-bold text-sm">
        ※ 마지막 갱신 시간 :{" "}
        {new Date(updatedDate).toLocaleString("ko", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </p>
      <div className="flex gap-1 items-center">
        {CARD_COUNTS.map((count) => (
          <button
            key={count}
            onClick={() => onCardCountChange(count)}
            className={`px-3 py-1 rounded text-sm font-bold transition-all ${
              cardCount === count
                ? "bg-amber-400 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {count}
          </button>
        ))}
        {process.env.NODE_ENV === "development" && <PostRatesButton />}
      </div>
    </div>
  );
}
