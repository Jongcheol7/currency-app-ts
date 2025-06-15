import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-between px-5 pt-4">
      <p className="text-2xl font-bold">☰</p>
      <p className="text-2xl font-bold">환율 계산기</p>
      <Link className="text-md font-bold" href={"/currency/exchangeMap"}>
        환전소
      </Link>
    </div>
  );
}
