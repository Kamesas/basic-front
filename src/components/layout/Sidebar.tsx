import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background p-4">
      <nav className="space-y-2">
        <Link
          href="/"
          className="block px-4 py-2 rounded hover:bg-accent transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className="block px-4 py-2 rounded hover:bg-accent transition-colors"
        >
          Profile
        </Link>
      </nav>
    </aside>
  );
}
