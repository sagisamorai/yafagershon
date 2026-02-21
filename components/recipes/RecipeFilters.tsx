"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface RecipeFiltersProps {
  categories: { id: string; name: string; slug: string }[];
}

export default function RecipeFilters({ categories }: RecipeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/recipes?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("q", search);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 mb-6">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש מתכון..."
            className="w-full rounded-lg border border-stone-300 bg-white pr-10 pl-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          חיפוש
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        <select
          value={searchParams.get("category") || ""}
          onChange={(e) => updateParams("category", e.target.value)}
          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="">כל הקטגוריות</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        <select
          value={searchParams.get("difficulty") || ""}
          onChange={(e) => updateParams("difficulty", e.target.value)}
          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="">כל רמות הקושי</option>
          <option value="EASY">קל</option>
          <option value="MEDIUM">בינוני</option>
          <option value="HARD">קשה</option>
        </select>

        <select
          value={searchParams.get("kashrut") || ""}
          onChange={(e) => updateParams("kashrut", e.target.value)}
          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="">כל סוגי הכשרות</option>
          <option value="KOSHER">כשר</option>
          <option value="DAIRY">חלבי</option>
          <option value="MEAT">בשרי</option>
          <option value="PAREVE">פרווה</option>
          <option value="NOT_KOSHER">לא כשר</option>
        </select>

        <select
          value={searchParams.get("sort") || "newest"}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="newest">חדש ביותר</option>
          <option value="popular">פופולרי ביותר</option>
          <option value="fastest">הכי מהיר</option>
        </select>
      </div>
    </div>
  );
}
