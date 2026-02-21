import { prisma } from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/utils";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeFilters from "@/components/recipes/RecipeFilters";
import Pagination from "@/components/ui/Pagination";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "מתכונים",
  description: "גלו את כל המתכונים הביתיים והטעימים של יפה - עיקריות, קינוחים, סלטים, מרקים ועוד.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    difficulty?: string;
    kashrut?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function RecipesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const where: Prisma.RecipeWhereInput = { status: "PUBLISHED" };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.difficulty) {
    where.difficulty = params.difficulty as "EASY" | "MEDIUM" | "HARD";
  }

  if (params.kashrut) {
    where.kashrut = params.kashrut as "KOSHER" | "NOT_KOSHER" | "DAIRY" | "MEAT" | "PAREVE";
  }

  let orderBy: Prisma.RecipeOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort === "popular") orderBy = { viewCount: "desc" };
  if (params.sort === "fastest") orderBy = { prepTime: "asc" };

  const [categories, totalCount, recipes] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.recipe.count({ where }),
    prisma.recipe.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-stone-800 mb-6">מתכונים</h1>

      <RecipeFilters categories={categories} />

      {recipes.length > 0 ? (
        <>
          <p className="text-sm text-stone-500 mb-4">
            {totalCount} מתכונים נמצאו
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-stone-500">לא נמצאו מתכונים מתאימים</p>
          <p className="text-sm text-stone-400 mt-1">נסו לשנות את הסינון או את מילות החיפוש</p>
        </div>
      )}
    </div>
  );
}
