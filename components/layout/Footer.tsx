import Link from "next/link";
import { ChefHat } from "lucide-react";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-3">
              <ChefHat className="w-6 h-6" />
              <span className="text-lg font-bold">המטבח של יפה</span>
            </div>
            <p className="text-sm text-stone-400">
              מתכונים ביתיים, טעימים ופשוטים להכנה. בואו לבשל איתנו!
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">ניווט מהיר</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">בית</Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-white transition-colors">מתכונים</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">אודות</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">צור קשר</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">עקבו אחרינו</h3>
            <SocialLinks size="md" showLabels />
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-8 text-center text-sm text-stone-500">
          <p>&copy; {new Date().getFullYear()} המטבח של יפה. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
