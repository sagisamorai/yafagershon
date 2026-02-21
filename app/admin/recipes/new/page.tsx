import { prisma } from "@/lib/prisma";
import RecipeForm from "@/components/admin/RecipeForm";

export default async function NewRecipePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">מתכון חדש</h1>
      <RecipeForm categories={categories} />
    </div>
  );
}
