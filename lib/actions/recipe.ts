"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { recipeSchema, type RecipeFormData } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createRecipe(data: RecipeFormData) {
  await requireAdmin();
  const parsed = recipeSchema.parse(data);

  const existingSlug = await prisma.recipe.findUnique({
    where: { slug: parsed.slug },
  });
  if (existingSlug) {
    throw new Error("slug כבר קיים, יש לבחור slug אחר");
  }

  const tagRecords = await Promise.all(
    (parsed.tags || []).filter(Boolean).map(async (tagName) => {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      return tag.id;
    })
  );

  const recipe = await prisma.recipe.create({
    data: {
      title: parsed.title,
      slug: parsed.slug,
      description: parsed.description,
      imageUrl: parsed.imageUrl || null,
      galleryImages: parsed.galleryImages || [],
      prepTime: parsed.prepTime,
      cookTime: parsed.cookTime,
      difficulty: parsed.difficulty,
      kashrut: parsed.kashrut,
      servings: parsed.servings,
      categoryId: parsed.categoryId || null,
      tips: parsed.tips || null,
      allergens: parsed.allergens || [],
      videoUrl: parsed.videoUrl || null,
      status: parsed.status,
      ingredients: {
        create: parsed.ingredients.map((ing, i) => ({
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          notes: ing.notes || null,
          order: i,
        })),
      },
      steps: {
        create: parsed.steps.map((step, i) => ({
          title: step.title,
          description: step.description,
          time: step.time || null,
          imageUrl: step.imageUrl || null,
          order: i,
        })),
      },
      tags: {
        create: tagRecords.map((tagId) => ({ tagId })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/recipes");
  revalidatePath("/admin/recipes");
  return recipe;
}

export async function updateRecipe(id: string, data: RecipeFormData) {
  await requireAdmin();
  const parsed = recipeSchema.parse(data);

  const existingSlug = await prisma.recipe.findFirst({
    where: { slug: parsed.slug, NOT: { id } },
  });
  if (existingSlug) {
    throw new Error("slug כבר קיים, יש לבחור slug אחר");
  }

  await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
  await prisma.recipeStep.deleteMany({ where: { recipeId: id } });
  await prisma.recipeTag.deleteMany({ where: { recipeId: id } });

  const tagRecords = await Promise.all(
    (parsed.tags || []).filter(Boolean).map(async (tagName) => {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      return tag.id;
    })
  );

  const recipe = await prisma.recipe.update({
    where: { id },
    data: {
      title: parsed.title,
      slug: parsed.slug,
      description: parsed.description,
      imageUrl: parsed.imageUrl || null,
      galleryImages: parsed.galleryImages || [],
      prepTime: parsed.prepTime,
      cookTime: parsed.cookTime,
      difficulty: parsed.difficulty,
      kashrut: parsed.kashrut,
      servings: parsed.servings,
      categoryId: parsed.categoryId || null,
      tips: parsed.tips || null,
      allergens: parsed.allergens || [],
      videoUrl: parsed.videoUrl || null,
      status: parsed.status,
      ingredients: {
        create: parsed.ingredients.map((ing, i) => ({
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          notes: ing.notes || null,
          order: i,
        })),
      },
      steps: {
        create: parsed.steps.map((step, i) => ({
          title: step.title,
          description: step.description,
          time: step.time || null,
          imageUrl: step.imageUrl || null,
          order: i,
        })),
      },
      tags: {
        create: tagRecords.map((tagId) => ({ tagId })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/recipes");
  revalidatePath(`/recipes/${recipe.slug}`);
  revalidatePath("/admin/recipes");
  return recipe;
}

export async function deleteRecipe(id: string) {
  await requireAdmin();
  await prisma.recipe.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/recipes");
  revalidatePath("/admin/recipes");
}

export async function duplicateRecipe(id: string) {
  await requireAdmin();
  const source = await prisma.recipe.findUniqueOrThrow({
    where: { id },
    include: { ingredients: true, steps: true, tags: { include: { tag: true } } },
  });

  const newSlug = `${source.slug}-copy-${Date.now()}`;

  const recipe = await prisma.recipe.create({
    data: {
      title: `${source.title} (העתק)`,
      slug: newSlug,
      description: source.description,
      imageUrl: source.imageUrl,
      galleryImages: source.galleryImages,
      prepTime: source.prepTime,
      cookTime: source.cookTime,
      difficulty: source.difficulty,
      kashrut: source.kashrut,
      servings: source.servings,
      categoryId: source.categoryId,
      tips: source.tips,
      allergens: source.allergens,
      videoUrl: source.videoUrl,
      status: "DRAFT",
      ingredients: {
        create: source.ingredients.map((ing) => ({
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          notes: ing.notes,
          order: ing.order,
        })),
      },
      steps: {
        create: source.steps.map((step) => ({
          title: step.title,
          description: step.description,
          time: step.time,
          imageUrl: step.imageUrl,
          order: step.order,
        })),
      },
      tags: {
        create: source.tags.map((rt) => ({ tagId: rt.tagId })),
      },
    },
  });

  revalidatePath("/admin/recipes");
  return recipe;
}
