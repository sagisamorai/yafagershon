import Link from "next/link";
import Image from "next/image";
import { ChefHat, Sparkles, TrendingUp, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/recipes/RecipeCard";
import ViewTracker from "@/components/tracking/ViewTracker";

export default async function HomePage() {
  const [newRecipes, popularRecipes] = await Promise.all([
    prisma.recipe.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.recipe.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: { viewCount: "desc" },
      take: 6,
    }),
  ]);

  return (
    <>
      <ViewTracker type="site" />

      <section className="bg-gradient-to-bl from-primary-50 via-white to-amber-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-primary-200">
              <Image
                src="/yafa-profile.png"
                alt="יפה - המטבח של יפה"
                width={112}
                height={112}
                className="w-full h-full object-cover scale-[1.05]"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4">
            המטבח של יפה
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-8">
            ברוכים הבאים למטבח שלי! כאן תמצאו מתכונים ביתיים, טעימים ופשוטים להכנה.
            מהמנות הראשונות ועד הקינוחים - הכל עם אהבה.
          </p>
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors text-lg"
          >
            לכל המתכונים
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {newRecipes.length > 0 && (
        <section className="container-page">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-stone-800">מתכונים חדשים</h2>
            </div>
            <Link href="/recipes?sort=newest" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              הצג הכל
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {popularRecipes.length > 0 && (
        <section className="container-page">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-stone-800">הכי פופולריים</h2>
            </div>
            <Link href="/recipes?sort=popular" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              הצג הכל
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {newRecipes.length === 0 && (
        <section className="container-page text-center py-20">
          <ChefHat className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-600 mb-2">עוד אין מתכונים</h2>
          <p className="text-stone-500">מתכונים חדשים יעלו בקרוב, הישארו מעודכנים!</p>
        </section>
      )}
    </>
  );
}
