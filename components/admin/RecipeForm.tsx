"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { recipeSchema, type RecipeFormData } from "@/lib/validators";
import { createRecipe, updateRecipe } from "@/lib/actions/recipe";
import { slugify } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import MultiImageUpload from "@/components/ui/MultiImageUpload";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface RecipeFormProps {
  categories: Category[];
  initialData?: RecipeFormData;
  recipeId?: string;
}

const ALLERGEN_OPTIONS = ["גלוטן", "ביצים", "חלב", "אגוזים", "בוטנים", "סויה", "דגים", "שומשום"];

export default function RecipeForm({ categories, initialData, recipeId }: RecipeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const isEdit = !!recipeId;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecipeFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(recipeSchema) as any,
    defaultValues: initialData || {
      title: "",
      slug: "",
      description: "",
      imageUrl: "",
      galleryImages: [],
      prepTime: 0,
      cookTime: 0,
      difficulty: "EASY",
      kashrut: "KOSHER",
      servings: 4,
      categoryId: "",
      tags: [],
      tips: "",
      allergens: [],
      videoUrl: "",
      status: "DRAFT",
      ingredients: [{ name: "", amount: "", unit: "", notes: "" }],
      steps: [{ title: "", description: "", time: undefined, imageUrl: "" }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ control, name: "steps" });

  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(", ") || "");

  const watchTitle = watch("title");
  const watchAllergens = watch("allergens") || [];
  const watchImageUrl = watch("imageUrl") || "";
  const watchGalleryImages = watch("galleryImages") || [];

  function generateSlug() {
    setValue("slug", slugify(watchTitle));
  }

  function toggleAllergen(allergen: string) {
    const current = watchAllergens;
    const next = current.includes(allergen)
      ? current.filter((a) => a !== allergen)
      : [...current, allergen];
    setValue("allergens", next);
  }

  function onSubmit(data: RecipeFormData) {
    setError("");
    data.tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    startTransition(async () => {
      try {
        if (isEdit) {
          await updateRecipe(recipeId!, data);
        } else {
          await createRecipe(data);
        }
        router.push("/admin/recipes");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "שגיאה בשמירת המתכון";
        setError(message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-800 mb-4">פרטים בסיסיים</h2>
        <div className="space-y-4">
          <Input
            label="כותרת המתכון"
            id="title"
            {...register("title")}
            error={errors.title?.message}
            placeholder="למשל: עוגת שוקולד ביתית"
          />
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="Slug (לכתובת URL)"
                id="slug"
                {...register("slug")}
                error={errors.slug?.message}
                placeholder="slug-shel-hamitkon"
              />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={generateSlug} className="mb-[2px]">
              צור אוטומטי
            </Button>
          </div>
          <Textarea
            label="תיאור קצר"
            id="description"
            {...register("description")}
            error={errors.description?.message}
            placeholder="תיאור קצר שיופיע בכרטיס המתכון"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-800 mb-4">תמונות</h2>
        <div className="space-y-6">
          <ImageUpload
            label="תמונה ראשית"
            value={watchImageUrl}
            onChange={(url) => setValue("imageUrl", url)}
          />
          <MultiImageUpload
            label="גלריית תמונות"
            value={watchGalleryImages}
            onChange={(urls) => setValue("galleryImages", urls)}
            max={8}
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-800 mb-4">זמנים ופרטים</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Input
            label="זמן הכנה (דקות)"
            id="prepTime"
            type="number"
            {...register("prepTime")}
            error={errors.prepTime?.message}
          />
          <Input
            label="זמן בישול (דקות)"
            id="cookTime"
            type="number"
            {...register("cookTime")}
            error={errors.cookTime?.message}
          />
          <Input
            label="מספר מנות"
            id="servings"
            type="number"
            {...register("servings")}
            error={errors.servings?.message}
          />
          <Select
            label="רמת קושי"
            id="difficulty"
            {...register("difficulty")}
            error={errors.difficulty?.message}
            options={[
              { value: "EASY", label: "קל" },
              { value: "MEDIUM", label: "בינוני" },
              { value: "HARD", label: "קשה" },
            ]}
          />
          <Select
            label="כשרות"
            id="kashrut"
            {...register("kashrut")}
            error={errors.kashrut?.message}
            options={[
              { value: "KOSHER", label: "כשר" },
              { value: "NOT_KOSHER", label: "לא כשר" },
              { value: "DAIRY", label: "חלבי" },
              { value: "MEAT", label: "בשרי" },
              { value: "PAREVE", label: "פרווה" },
            ]}
          />
          <Select
            label="סטטוס"
            id="status"
            {...register("status")}
            error={errors.status?.message}
            options={[
              { value: "DRAFT", label: "טיוטה" },
              { value: "PUBLISHED", label: "מפורסם" },
            ]}
          />
        </div>
        <div className="mt-4">
          <Input
            label="קישור לסרטון (YouTube/TikTok/Instagram)"
            id="videoUrl"
            {...register("videoUrl")}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-800 mb-4">קטגוריה ותגיות</h2>
        <div className="space-y-4">
          <Select
            label="קטגוריה"
            id="categoryId"
            {...register("categoryId")}
            placeholder="בחר קטגוריה"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">תגיות (מופרדות בפסיקים)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="שוקולד, עוגות, קל להכנה"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-800">מרכיבים</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendIngredient({ name: "", amount: "", unit: "", notes: "" })}
          >
            <Plus className="w-4 h-4 ml-1" />
            הוסף מרכיב
          </Button>
        </div>
        {errors.ingredients?.root && (
          <p className="text-sm text-red-600 mb-3">{errors.ingredients.root.message}</p>
        )}
        <div className="space-y-3">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start p-3 bg-stone-50 rounded-lg">
              <GripVertical className="w-4 h-4 text-stone-300 mt-2 flex-shrink-0" />
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Input
                  placeholder="שם המרכיב"
                  {...register(`ingredients.${index}.name`)}
                  error={errors.ingredients?.[index]?.name?.message}
                />
                <Input
                  placeholder="כמות"
                  {...register(`ingredients.${index}.amount`)}
                  error={errors.ingredients?.[index]?.amount?.message}
                />
                <Input
                  placeholder="יחידה"
                  {...register(`ingredients.${index}.unit`)}
                  error={errors.ingredients?.[index]?.unit?.message}
                />
                <Input
                  placeholder="הערות"
                  {...register(`ingredients.${index}.notes`)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded mt-1"
                disabled={ingredientFields.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-800">שלבי הכנה</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendStep({ title: "", description: "", time: undefined, imageUrl: "" })}
          >
            <Plus className="w-4 h-4 ml-1" />
            הוסף שלב
          </Button>
        </div>
        {errors.steps?.root && (
          <p className="text-sm text-red-600 mb-3">{errors.steps.root.message}</p>
        )}
        <div className="space-y-4">
          {stepFields.map((field, index) => {
            const stepImageUrl = watch(`steps.${index}.imageUrl`) || "";
            return (
              <div key={field.id} className="p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-stone-500">שלב {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    disabled={stepFields.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <Input
                    label="כותרת השלב"
                    {...register(`steps.${index}.title`)}
                    error={errors.steps?.[index]?.title?.message}
                    placeholder="למשל: הכנת הבצק"
                  />
                  <Textarea
                    label="תיאור"
                    {...register(`steps.${index}.description`)}
                    error={errors.steps?.[index]?.description?.message}
                    placeholder="תארו את השלב בפירוט"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="זמן משוער (דקות)"
                      type="number"
                      {...register(`steps.${index}.time`)}
                    />
                    <ImageUpload
                      label="תמונה לשלב (אופציונלי)"
                      value={stepImageUrl}
                      onChange={(url) => setValue(`steps.${index}.imageUrl`, url)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-800 mb-4">טיפים ואלרגנים</h2>
        <div className="space-y-4">
          <Textarea
            label="טיפים"
            id="tips"
            {...register("tips")}
            placeholder="טיפים והמלצות להכנת המתכון"
          />
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">אלרגנים</label>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((allergen) => (
                <button
                  key={allergen}
                  type="button"
                  onClick={() => toggleAllergen(allergen)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    watchAllergens.includes(allergen)
                      ? "bg-red-100 border-red-300 text-red-700"
                      : "bg-white border-stone-300 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} size="lg">
          {isPending ? "שומר..." : isEdit ? "עדכן מתכון" : "צור מתכון"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          ביטול
        </Button>
      </div>
    </form>
  );
}
