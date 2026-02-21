import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Clock, Users, ChefHat, AlertTriangle, Play, Share2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ViewTracker from "@/components/tracking/ViewTracker";
import {
  difficultyLabel,
  kashrutLabel,
  formatMinutes,
  totalTime,
  formatDate,
} from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { slug, status: "PUBLISHED" },
  });
  if (!recipe) return { title: "מתכון לא נמצא" };
  return {
    title: recipe.title,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: recipe.imageUrl ? [recipe.imageUrl] : [],
    },
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      ingredients: { orderBy: { order: "asc" } },
      steps: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
    },
  });

  if (!recipe) notFound();

  const total = totalTime(recipe.prepTime, recipe.cookTime);

  return (
    <>
      <ViewTracker type="recipe" recipeId={recipe.id} />

      <article className="container-page max-w-4xl">
        <header className="mb-8">
          {recipe.imageUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-stone-100">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {recipe.category && <Badge variant="warning">{recipe.category.name}</Badge>}
            <Badge>{difficultyLabel(recipe.difficulty)}</Badge>
            <Badge variant="info">{kashrutLabel(recipe.kashrut)}</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3">
            {recipe.title}
          </h1>
          <p className="text-lg text-stone-600 mb-4">{recipe.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              הכנה: {formatMinutes(recipe.prepTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              בישול: {formatMinutes(recipe.cookTime)}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-primary-700">
              <Clock className="w-4 h-4" />
              סה&quot;כ: {formatMinutes(total)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {recipe.servings} מנות
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-stone-400">
            <span>פורסם: {formatDate(recipe.createdAt)}</span>
            <span>|</span>
            <span>{recipe.viewCount} צפיות</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-20">
              <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary-500" />
                מרכיבים
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                    <span>
                      <strong>{ing.amount} {ing.unit}</strong> {ing.name}
                      {ing.notes && (
                        <span className="text-stone-400"> ({ing.notes})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-6">שלבי הכנה</h2>
              <ol className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <li key={step.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-800 mb-1">{step.title}</h3>
                      <p className="text-sm text-stone-600 leading-relaxed">{step.description}</p>
                      {step.time && (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-400 mt-2">
                          <Clock className="w-3 h-3" />
                          {formatMinutes(step.time)}
                        </span>
                      )}
                      {step.imageUrl && (
                        <img
                          src={step.imageUrl}
                          alt={step.title}
                          className="mt-3 rounded-lg max-h-48 object-cover"
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {recipe.tips && (
              <section className="bg-primary-50 rounded-xl p-6">
                <h2 className="text-lg font-bold text-primary-800 mb-2">טיפים</h2>
                <p className="text-sm text-primary-700 leading-relaxed whitespace-pre-wrap">{recipe.tips}</p>
              </section>
            )}

            {recipe.allergens.length > 0 && (
              <section className="bg-red-50 rounded-xl p-6">
                <h2 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  אלרגנים
                </h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.allergens.map((a) => (
                    <Badge key={a} variant="danger">{a}</Badge>
                  ))}
                </div>
              </section>
            )}

            {recipe.videoUrl && (
              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary-500" />
                  סרטון
                </h2>
                <a
                  href={recipe.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  צפו בסרטון ההכנה
                </a>
              </section>
            )}

            {recipe.galleryImages.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-stone-800 mb-3">גלריה</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {recipe.galleryImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${recipe.title} - תמונה ${i + 1}`}
                      className="rounded-lg aspect-square object-cover"
                    />
                  ))}
                </div>
              </section>
            )}

            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-200">
                {recipe.tags.map((rt) => (
                  <Badge key={rt.tagId} variant="default">#{rt.tag.name}</Badge>
                ))}
              </div>
            )}

            <ShareButton title={recipe.title} />
          </div>
        </div>
      </article>
    </>
  );
}

function ShareButton({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 pt-4 border-t border-stone-200">
      <Share2 className="w-4 h-4 text-stone-400" />
      <span className="text-sm text-stone-500">שתפו את המתכון &quot;{title}&quot;</span>
    </div>
  );
}
