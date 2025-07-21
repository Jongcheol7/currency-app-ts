"use client";

import { useState } from "react";

export default function PostRatesButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/current-rates", {
        method: "POST",
      });

      if (!res.ok) throw new Error("POST 요청 실패");

      const json = await res.json();
      setMessage(`성공적으로 ${json.count}개 저장됨`);
    } catch (err) {
      console.error("에러 발생:", err);
      setMessage("저장 실패!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "저장 중..." : "실시간 환율 저장"}
      </button>
      {message && <span>{message}</span>}
    </div>
  );
}
