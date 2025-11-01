import { ThemeChanger } from "@/components/ThemeChanger/ThemeChanger";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 gap-4">
        <Link href={"/"} className="font-semibold text-lg">
          Basic App
        </Link>
        <nav className="flex-1 flex gap-4 ml-8">
          <Link href="/" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
        </nav>
        <ThemeChanger />
      </div>
    </header>
  );
}
