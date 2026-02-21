import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "שם הקטגוריה נדרש"),
  slug: z.string().min(1, "slug נדרש"),
});

export const ingredientSchema = z.object({
  name: z.string().min(1, "שם המרכיב נדרש"),
  amount: z.string().min(1, "כמות נדרשת"),
  unit: z.string().min(1, "יחידה נדרשת"),
  notes: z.string().optional().default(""),
});

export const stepSchema = z.object({
  title: z.string().min(1, "כותרת השלב נדרשת"),
  description: z.string().min(1, "תיאור השלב נדרש"),
  time: z.coerce.number().optional(),
  imageUrl: z.string().optional().default(""),
});

export const recipeSchema = z.object({
  title: z.string().min(1, "כותרת המתכון נדרשת"),
  slug: z.string().min(1, "slug נדרש"),
  description: z.string().min(1, "תיאור המתכון נדרש"),
  imageUrl: z.string().optional().default(""),
  galleryImages: z.array(z.string()).optional().default([]),
  prepTime: z.coerce.number().min(0, "זמן הכנה לא תקין"),
  cookTime: z.coerce.number().min(0, "זמן בישול לא תקין"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], "יש לבחור רמת קושי"),
  kashrut: z.enum(["KOSHER", "NOT_KOSHER", "DAIRY", "MEAT", "PAREVE"], "יש לבחור כשרות"),
  servings: z.coerce.number().min(1, "מספר מנות לא תקין"),
  categoryId: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  tips: z.string().optional().default(""),
  allergens: z.array(z.string()).optional().default([]),
  videoUrl: z.string().optional().default(""),
  status: z.enum(["DRAFT", "PUBLISHED"], "יש לבחור סטטוס"),
  ingredients: z.array(ingredientSchema).min(1, "נדרש לפחות מרכיב אחד"),
  steps: z.array(stepSchema).min(1, "נדרש לפחות שלב אחד"),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;

export const trackViewSchema = z.object({
  recipeId: z.string().uuid().optional(),
});
