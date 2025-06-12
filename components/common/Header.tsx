import { Menu } from "lucide-react";

export default function Header() {
  return (
    <div className="flex justify-between px-5 py-5">
      <Menu />
      <p className="text-2xl font-bold">환율 계산기</p>
      <p></p>
    </div>
  );
}
