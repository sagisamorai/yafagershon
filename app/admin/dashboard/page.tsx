import { prisma } from "@/lib/prisma";
import { Eye, BookOpen, TrendingUp, Users } from "lucide-react";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Link from "next/link";
import { formatShortDate } from "@/lib/utils";
import DashboardChart from "@/components/admin/DashboardChart";

async function getStats() {
  const now = new Date();
  const day = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    siteViews24h,
    siteViews7d,
    siteViews30d,
    siteViewsTotal,
    recipeCount,
    publishedCount,
    topRecipes,
    recentRecipes,
  ] = await Promise.all([
    prisma.viewEvent.count({ where: { scope: "SITE", createdAt: { gte: day } } }),
    prisma.viewEvent.count({ where: { scope: "SITE", createdAt: { gte: week } } }),
    prisma.viewEvent.count({ where: { scope: "SITE", createdAt: { gte: month } } }),
    prisma.viewEvent.count({ where: { scope: "SITE" } }),
    prisma.recipe.count(),
    prisma.recipe.count({ where: { status: "PUBLISHED" } }),
    prisma.recipe.findMany({
      select: { id: true, title: true, slug: true, viewCount: true },
      orderBy: { viewCount: "desc" },
      take: 10,
    }),
    prisma.recipe.findMany({
      select: { id: true, title: true, slug: true, status: true, createdAt: true, viewCount: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    siteViews24h,
    siteViews7d,
    siteViews30d,
    siteViewsTotal,
    recipeCount,
    publishedCount,
    topRecipes,
    recentRecipes,
  };
}

async function getChartData() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const events = await prisma.viewEvent.findMany({
    where: { scope: "SITE", createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const daily: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    daily[key] = 0;
  }

  events.forEach((e) => {
    const key = e.createdAt.toISOString().split("T")[0];
    if (daily[key] !== undefined) daily[key]++;
  });

  return Object.entries(daily).map(([date, count]) => ({
    date: date.slice(5),
    views: count,
  }));
}

export default async function DashboardPage() {
  const [stats, chartData] = await Promise.all([getStats(), getChartData()]);

  const statCards = [
    { label: "צפיות 24 שעות", value: stats.siteViews24h, icon: Eye, color: "text-blue-600 bg-blue-100" },
    { label: "צפיות 7 ימים", value: stats.siteViews7d, icon: TrendingUp, color: "text-green-600 bg-green-100" },
    { label: "צפיות 30 יום", value: stats.siteViews30d, icon: Users, color: "text-purple-600 bg-purple-100" },
    { label: "סה\"כ צפיות", value: stats.siteViewsTotal, icon: Eye, color: "text-amber-600 bg-amber-100" },
    { label: "סה\"כ מתכונים", value: stats.recipeCount, icon: BookOpen, color: "text-stone-600 bg-stone-100" },
    { label: "מתכונים מפורסמים", value: stats.publishedCount, icon: BookOpen, color: "text-emerald-600 bg-emerald-100" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">דשבורד</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-800">{s.value.toLocaleString("he-IL")}</p>
                <p className="text-xs text-stone-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h2 className="font-bold text-stone-800">מגמת צפיות - 30 ימים אחרונים</h2>
          </CardHeader>
          <CardContent>
            <DashboardChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-bold text-stone-800">מתכונים פופולריים</h2>
          </CardHeader>
          <CardContent>
            {stats.topRecipes.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-right py-2 font-medium text-stone-600">#</th>
                    <th className="text-right py-2 font-medium text-stone-600">מתכון</th>
                    <th className="text-right py-2 font-medium text-stone-600">צפיות</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topRecipes.map((r, i) => (
                    <tr key={r.id} className="border-b border-stone-50">
                      <td className="py-2 text-stone-400">{i + 1}</td>
                      <td className="py-2">
                        <Link href={`/admin/recipes/${r.id}/edit`} className="text-primary-600 hover:underline">
                          {r.title}
                        </Link>
                      </td>
                      <td className="py-2 font-medium">{r.viewCount.toLocaleString("he-IL")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-stone-500 text-center py-4">אין מתכונים עדיין</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-stone-800">מתכונים אחרונים</h2>
            <Link href="/admin/recipes" className="text-primary-600 text-sm hover:underline">הצג הכל</Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentRecipes.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-right py-2 font-medium text-stone-600">כותרת</th>
                  <th className="text-right py-2 font-medium text-stone-600">סטטוס</th>
                  <th className="text-right py-2 font-medium text-stone-600">תאריך</th>
                  <th className="text-right py-2 font-medium text-stone-600">צפיות</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentRecipes.map((r) => (
                  <tr key={r.id} className="border-b border-stone-50">
                    <td className="py-2">
                      <Link href={`/admin/recipes/${r.id}/edit`} className="text-primary-600 hover:underline">
                        {r.title}
                      </Link>
                    </td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-600"}`}>
                        {r.status === "PUBLISHED" ? "מפורסם" : "טיוטה"}
                      </span>
                    </td>
                    <td className="py-2 text-stone-500">{formatShortDate(r.createdAt)}</td>
                    <td className="py-2 font-medium">{r.viewCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-stone-500 text-center py-4">אין מתכונים עדיין</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
