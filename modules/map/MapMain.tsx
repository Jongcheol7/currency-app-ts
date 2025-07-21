"use client";
import { useRouter } from "next/navigation";
import { Map } from "lucide-react";
import MapContent from "./MapContent";
export default function MapMain() {
  const router = useRouter();
  return (
    <div className="">
      <div className="relative flex justify-between items-center">
        <p
          className="py-2 ml-2 my-2 font-bold hover:text-blue-500"
          onClick={() => router.push("/")}
        >
          뒤로가기
        </p>
        <div className="absolute flex items-center gap-1 left-1/2 -translate-x-1/2 transform py-2 my-2 text-2xl font-bold">
          <Map />
          <p>환전소 위치</p>
        </div>
        <p></p>
      </div>
      <MapContent />
    </div>
  );
}
