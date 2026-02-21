import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Tags, ArrowRight } from "lucide-react";

const adminLinks = [
  { href: "/admin/dashboard", label: "דשבורד", icon: LayoutDashboard },
  { href: "/admin/recipes", label: "מתכונים", icon: BookOpen },
  { href: "/admin/categories", label: "קטגוריות", icon: Tags },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <aside className="w-56 bg-stone-800 text-stone-300 flex-shrink-0 hidden md:block">
        <div className="p-4 border-b border-stone-700">
          <h2 className="text-white font-bold text-lg">פאנל ניהול</h2>
          <Link href="/" className="text-xs text-stone-400 hover:text-white flex items-center gap-1 mt-1">
            <ArrowRight className="w-3 h-3" />
            חזרה לאתר
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-stone-700 hover:text-white transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 bg-stone-50">
        <div className="md:hidden bg-stone-800 text-white p-3 flex items-center gap-4 overflow-x-auto">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm hover:bg-stone-700 whitespace-nowrap"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
