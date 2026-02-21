import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RecipeForm from "@/components/admin/RecipeForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;

  const [recipe, categories] = await Promise.all([
    prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: { orderBy: { order: "asc" } },
        steps: { orderBy: { order: "asc" } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!recipe) notFound();

  const formData = {
    title: recipe.title,
    slug: recipe.slug,
    description: recipe.description,
    imageUrl: recipe.imageUrl || "",
    galleryImages: recipe.galleryImages,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    difficulty: recipe.difficulty,
    kashrut: recipe.kashrut,
    servings: recipe.servings,
    categoryId: recipe.categoryId || "",
    tags: recipe.tags.map((rt) => rt.tag.name),
    tips: recipe.tips || "",
    allergens: recipe.allergens,
    videoUrl: recipe.videoUrl || "",
    status: recipe.status,
    ingredients: recipe.ingredients.map((ing) => ({
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      notes: ing.notes || "",
    })),
    steps: recipe.steps.map((step) => ({
      title: step.title,
      description: step.description,
      time: step.time || undefined,
      imageUrl: step.imageUrl || "",
    })),
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">עריכת מתכון: {recipe.title}</h1>
      <RecipeForm categories={categories} initialData={formData} recipeId={recipe.id} />
    </div>
  );
}
