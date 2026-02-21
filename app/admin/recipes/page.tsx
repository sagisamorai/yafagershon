import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import AdminRecipeTable from "@/components/admin/AdminRecipeTable";

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function AdminRecipesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const where: Record<string, unknown> = {};
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { slug: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.status === "PUBLISHED" || params.status === "DRAFT") {
    where.status = params.status;
  }

  const recipes = await prisma.recipe.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">ניהול מתכונים</h1>
        <Link href="/admin/recipes/new">
          <Button>
            <Plus className="w-4 h-4 ml-1" />
            מתכון חדש
          </Button>
        </Link>
      </div>

      <AdminRecipeTable
        recipes={recipes}
        currentSearch={params.q || ""}
        currentStatus={params.status || ""}
      />
    </div>
  );
}
