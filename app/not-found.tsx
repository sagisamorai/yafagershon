import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page text-center py-20">
      <ChefHat className="w-20 h-20 text-stone-300 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-stone-700 mb-3">404</h1>
      <h2 className="text-xl text-stone-600 mb-2">העמוד לא נמצא</h2>
      <p className="text-stone-500 mb-6">
        נראה שהעמוד שחיפשתם לא קיים. אולי המתכון עבר מקום?
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors"
      >
        חזרה לעמוד הבית
      </Link>
    </div>
  );
}
