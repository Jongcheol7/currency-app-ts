"use client";
import { Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LanguegePopup from "../currency/LanguagePopup";

export default function Header() {
  const [isLanPopShow, setIsLanPopShow] = useState(false);
  return (
    <>
      {isLanPopShow && <LanguegePopup setIsLanPopShow={setIsLanPopShow} />}
      <div className="relative flex justify-between items-center px-5 pt-4">
        <button onClick={() => setIsLanPopShow(!isLanPopShow)}>
          <Globe className="hover:text-blue-500" />
        </button>

        <p className="absolute left-1/2 -translate-x-1/2 transform text-2xl font-bold">
          환율 계산기
        </p>
        <Link className="text-md font-bold hover:text-blue-500" href={"/map"}>
          환전소
        </Link>
      </div>
    </>
  );
}
