"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { categorySchema, type CategoryFormData } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createCategory(data: CategoryFormData) {
  await requireAdmin();
  const parsed = categorySchema.parse(data);

  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: parsed.name }, { slug: parsed.slug }] },
  });
  if (existing) {
    throw new Error("קטגוריה עם שם או slug זהה כבר קיימת");
  }

  const category = await prisma.category.create({ data: parsed });
  revalidatePath("/admin/categories");
  revalidatePath("/recipes");
  return category;
}

export async function updateCategory(id: string, data: CategoryFormData) {
  await requireAdmin();
  const parsed = categorySchema.parse(data);

  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: parsed.name }, { slug: parsed.slug }], NOT: { id } },
  });
  if (existing) {
    throw new Error("קטגוריה עם שם או slug זהה כבר קיימת");
  }

  const category = await prisma.category.update({
    where: { id },
    data: parsed,
  });
  revalidatePath("/admin/categories");
  revalidatePath("/recipes");
  return category;
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/recipes");
}
