import Link from "next/link";

export default function Header() {
  return (
    <div className="relative flex justify-between items-center px-5 pt-4">
      <p className=" text-2xl font-bold hover:text-blue-500">☰</p>
      <p className="absolute left-1/2 -translate-x-1/2 transform text-2xl font-bold">
        환율 계산기
      </p>
      <Link
        className="text-md font-bold hover:text-blue-500"
        href={"/currency/exchangeMap"}
      >
        환전소
      </Link>
    </div>
  );
}
