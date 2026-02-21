import Link from "next/link";
import { Clock, Users, ChefHat } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { difficultyLabel, kashrutLabel, formatMinutes, totalTime } from "@/lib/utils";

interface RecipeCardProps {
  recipe: {
    slug: string;
    title: string;
    description: string;
    imageUrl: string | null;
    prepTime: number;
    cookTime: number;
    difficulty: string;
    kashrut: string;
    servings: number;
    viewCount: number;
    category?: { name: string } | null;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const total = totalTime(recipe.prepTime, recipe.cookTime);

  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block">
      <article className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden transition-all group-hover:shadow-md group-hover:-translate-y-0.5">
        <div className="aspect-[4/3] relative bg-stone-100">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <ChefHat className="w-16 h-16" />
            </div>
          )}
          {recipe.category && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning">{recipe.category.name}</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-stone-800 group-hover:text-primary-700 transition-colors line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-sm text-stone-500 mt-1 line-clamp-2">{recipe.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatMinutes(total)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {recipe.servings} מנות
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge>{difficultyLabel(recipe.difficulty)}</Badge>
            <Badge variant="info">{kashrutLabel(recipe.kashrut)}</Badge>
          </div>
        </div>
      </article>
    </Link>
  );
}
