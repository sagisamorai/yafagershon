import { prisma } from "@/lib/prisma";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { recipes: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">ניהול קטגוריות</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
