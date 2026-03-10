"use client";
import PostRatesButton from "./PostRateButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, LayoutGrid } from "lucide-react";

type CardCount = 2 | 3 | 4 | 5 | 6;

type Props = {
  updatedDate: Date;
  cardCount: number;
  onCardCountChange: (count: CardCount) => void;
};

export default function CurrencyHeader({
  updatedDate,
  cardCount,
  onCardCountChange,
}: Props) {
  return (
    <div className="flex justify-between items-center mt-1">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Clock className="size-3.5" />
        <p className="text-xs font-medium">
          {new Date(updatedDate).toLocaleString("ko", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-1.5">
          <LayoutGrid className="size-4 text-slate-400" />
          <Select
            value={String(cardCount)}
            onValueChange={(v) => onCardCountChange(Number(v) as CardCount)}
          >
            <SelectTrigger size="sm" className="w-20 bg-white/80 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6].map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count}개
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {process.env.NODE_ENV === "development" && <PostRatesButton />}
      </div>
    </div>
  );
}
