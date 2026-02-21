"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Pencil, Trash2, Copy, Search, Eye } from "lucide-react";
import Link from "next/link";
import { deleteRecipe, duplicateRecipe } from "@/lib/actions/recipe";
import { formatShortDate, statusLabel } from "@/lib/utils";

interface Recipe {
  id: string;
  title: string;
  slug: string;
  status: string;
  viewCount: number;
  createdAt: Date;
  category: { name: string } | null;
}

interface Props {
  recipes: Recipe[];
  currentSearch: string;
  currentStatus: string;
}

export default function AdminRecipeTable({ recipes, currentSearch, currentStatus }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (currentStatus) params.set("status", currentStatus);
    router.push(`/admin/recipes?${params.toString()}`);
  }

  function handleStatusFilter(status: string) {
    const params = new URLSearchParams();
    if (currentSearch) params.set("q", currentSearch);
    if (status) params.set("status", status);
    router.push(`/admin/recipes?${params.toString()}`);
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`למחוק את "${title}"?`)) return;
    startTransition(async () => {
      await deleteRecipe(id);
      router.refresh();
    });
  }

  function handleDuplicate(id: string) {
    startTransition(async () => {
      await duplicateRecipe(id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש לפי כותרת..."
              className="w-full rounded-lg border border-stone-300 bg-white pr-10 pl-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          </div>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
            חיפוש
          </button>
        </form>
        <div className="flex gap-2">
          {["", "PUBLISHED", "DRAFT"].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentStatus === s
                  ? "bg-primary-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {s === "" ? "הכל" : statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {recipes.length === 0 ? (
          <p className="text-stone-500 text-center py-8">לא נמצאו מתכונים</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">כותרת</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">קטגוריה</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">סטטוס</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">צפיות</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">תאריך</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((r) => (
                  <tr key={r.id} className="border-t border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium">{r.title}</td>
                    <td className="px-4 py-3 text-stone-500">{r.category?.name || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-600"}`}>
                        {statusLabel(r.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">{r.viewCount}</td>
                    <td className="px-4 py-3 text-stone-500">{formatShortDate(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/recipes/${r.slug}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-stone-100 text-stone-500"
                          title="צפייה"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/recipes/${r.id}/edit`}
                          className="p-1.5 rounded hover:bg-stone-100 text-blue-600"
                          title="עריכה"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(r.id)}
                          disabled={isPending}
                          className="p-1.5 rounded hover:bg-stone-100 text-stone-500"
                          title="שכפול"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.title)}
                          disabled={isPending}
                          className="p-1.5 rounded hover:bg-stone-100 text-red-600"
                          title="מחיקה"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
