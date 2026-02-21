"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/category";
import { slugify } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { recipes: number };
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showNew, setShowNew] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [error, setError] = useState("");

  function handleCreate() {
    if (!newName.trim()) return;
    setError("");
    startTransition(async () => {
      try {
        await createCategory({
          name: newName.trim(),
          slug: newSlug.trim() || slugify(newName),
        });
        setNewName("");
        setNewSlug("");
        setShowNew(false);
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "שגיאה");
      }
    });
  }

  function startEdit(cat: Category) {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  }

  function handleUpdate() {
    if (!editId || !editName.trim()) return;
    setError("");
    startTransition(async () => {
      try {
        await updateCategory(editId!, {
          name: editName.trim(),
          slug: editSlug.trim() || slugify(editName),
        });
        setEditId(null);
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "שגיאה");
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`למחוק את הקטגוריה "${name}"?`)) return;
    startTransition(async () => {
      try {
        await deleteCategory(id);
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "שגיאה");
      }
    });
  }

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        {showNew ? (
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="שם הקטגוריה"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNewSlug(slugify(e.target.value));
                }}
              />
              <Input
                placeholder="slug"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreate} disabled={isPending}>
                <Check className="w-4 h-4 ml-1" />
                שמור
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowNew(false)}>
                <X className="w-4 h-4 ml-1" />
                ביטול
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setShowNew(true)}>
            <Plus className="w-4 h-4 ml-1" />
            קטגוריה חדשה
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-stone-500 text-center py-8">אין קטגוריות עדיין</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-right px-4 py-3 font-medium text-stone-600">שם</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Slug</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">מתכונים</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t border-stone-100">
                  {editId === cat.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">{cat._count.recipes}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-1">
                          <button onClick={handleUpdate} disabled={isPending} className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditId(null)} className="p-1 text-stone-500 hover:bg-stone-50 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium">{cat.name}</td>
                      <td className="px-4 py-3 text-stone-500">{cat.slug}</td>
                      <td className="px-4 py-3">{cat._count.recipes}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(cat)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(cat.id, cat.name)} disabled={isPending} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
