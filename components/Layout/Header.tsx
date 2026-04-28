import Link from "next/link";
import LangSwitcher from "../LangSwitcher/LangSwitcher";

export default function Header() {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between">
      <Link href="/" className="text-xl font-semibold text-gray-900">
        Outline
      </Link>

      <LangSwitcher />
    </header>
  );
}
