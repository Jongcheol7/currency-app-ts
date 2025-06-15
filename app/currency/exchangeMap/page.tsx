"use client";
import { useRouter } from "next/navigation";
import ExchangeMap from "./ExchangeMap";
export default function ExchangeMapPage() {
  const router = useRouter();
  return (
    <div className="">
      <div className="flex justify-between">
        <p
          className="py-2 my-2 font-bold hover:text-blue-500"
          onClick={() => router.push("/")}
        >
          뒤로가기
        </p>
        <p className="py-2 my-2 font-bold">🗺️ 환전소 위치 🗺️</p>
        <p></p>
      </div>
      <ExchangeMap />
    </div>
  );
}
