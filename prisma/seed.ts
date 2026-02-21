import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("מתחיל seed...");

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "main-dishes" },
      update: {},
      create: { name: "עיקריות", slug: "main-dishes" },
    }),
    prisma.category.upsert({
      where: { slug: "desserts" },
      update: {},
      create: { name: "קינוחים", slug: "desserts" },
    }),
    prisma.category.upsert({
      where: { slug: "salads" },
      update: {},
      create: { name: "סלטים", slug: "salads" },
    }),
    prisma.category.upsert({
      where: { slug: "soups" },
      update: {},
      create: { name: "מרקים", slug: "soups" },
    }),
    prisma.category.upsert({
      where: { slug: "baking" },
      update: {},
      create: { name: "מאפים", slug: "baking" },
    }),
    prisma.category.upsert({
      where: { slug: "side-dishes" },
      update: {},
      create: { name: "תוספות", slug: "side-dishes" },
    }),
  ]);

  const existing = await prisma.recipe.findUnique({
    where: { slug: "ugat-shokolad-bytit" },
  });

  if (!existing) {
    await prisma.recipe.create({
      data: {
        title: "עוגת שוקולד ביתית",
        slug: "ugat-shokolad-bytit",
        description:
          "עוגת שוקולד עשירה וטעימה שמכינים בקלות בבית. מושלמת לכל אירוע!",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
        prepTime: 20,
        cookTime: 35,
        difficulty: "EASY",
        kashrut: "PAREVE",
        servings: 10,
        tips: "אפשר להוסיף שבבי שוקולד לבצק לפני אפייה.\nאם רוצים עוגה יותר רכה, להוריד 5 דקות מזמן האפייה.",
        allergens: ["גלוטן", "ביצים"],
        status: "PUBLISHED",
        categoryId: categories[1].id,
        galleryImages: [],
        ingredients: {
          create: [
            { name: "קמח", amount: "2", unit: "כוסות", order: 0 },
            { name: "סוכר", amount: "1.5", unit: "כוסות", order: 1 },
            { name: "קקאו", amount: "0.5", unit: "כוס", order: 2 },
            { name: "ביצים", amount: "3", unit: "יחידות", order: 3 },
            { name: "שמן", amount: "0.5", unit: "כוס", order: 4 },
            { name: "מים רותחים", amount: "1", unit: "כוס", order: 5 },
            { name: "אבקת אפייה", amount: "1", unit: "כפית", order: 6 },
            { name: "סודה לשתייה", amount: "1", unit: "כפית", order: 7 },
            { name: "מלח", amount: "0.5", unit: "כפית", order: 8 },
            { name: "תמצית וניל", amount: "1", unit: "כפית", order: 9 },
          ],
        },
        steps: {
          create: [
            {
              title: "חימום תנור",
              description: "מחממים תנור ל-180 מעלות. מורחים תבנית בשמן ומקמחים.",
              order: 0,
            },
            {
              title: "ערבוב יבשים",
              description: "בקערה גדולה מערבבים את הקמח, הסוכר, הקקאו, אבקת האפייה, הסודה והמלח.",
              order: 1,
            },
            {
              title: "הוספת רטובים",
              description: "מוסיפים את הביצים, השמן ותמצית הוניל. מערבבים היטב.",
              order: 2,
            },
            {
              title: "הוספת מים",
              description: "מוסיפים את המים הרותחים ומערבבים. הבצק יהיה נוזלי - זה בסדר!",
              time: 2,
              order: 3,
            },
            {
              title: "אפייה",
              description: "יוצקים לתבנית ואופים כ-35 דקות או עד שקיסם יוצא נקי.",
              time: 35,
              order: 4,
            },
          ],
        },
        tags: {
          create: [
            {
              tag: {
                connectOrCreate: {
                  where: { name: "שוקולד" },
                  create: { name: "שוקולד" },
                },
              },
            },
            {
              tag: {
                connectOrCreate: {
                  where: { name: "אפייה" },
                  create: { name: "אפייה" },
                },
              },
            },
            {
              tag: {
                connectOrCreate: {
                  where: { name: "קל להכנה" },
                  create: { name: "קל להכנה" },
                },
              },
            },
          ],
        },
      },
    });
    console.log("נוצר מתכון דוגמה: עוגת שוקולד ביתית");
  }

  const existing2 = await prisma.recipe.findUnique({
    where: { slug: "salat-yerakot-israel" },
  });

  if (!existing2) {
    await prisma.recipe.create({
      data: {
        title: "סלט ירקות ישראלי",
        slug: "salat-yerakot-israel",
        description: "סלט ישראלי קלאסי וטרי עם ירקות חתוכים דק ורוטב לימון.",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
        prepTime: 15,
        cookTime: 0,
        difficulty: "EASY",
        kashrut: "PAREVE",
        servings: 4,
        tips: "ככל שהירקות חתוכים יותר דק, הסלט טעים יותר.\nאפשר להוסיף נענע טרייה.",
        allergens: [],
        status: "PUBLISHED",
        categoryId: categories[2].id,
        galleryImages: [],
        ingredients: {
          create: [
            { name: "עגבניות", amount: "4", unit: "יחידות", order: 0 },
            { name: "מלפפונים", amount: "3", unit: "יחידות", order: 1 },
            { name: "בצל", amount: "1", unit: "יחידה", notes: "קטן", order: 2 },
            { name: "פלפל", amount: "1", unit: "יחידה", order: 3 },
            { name: "שמן זית", amount: "3", unit: "כפות", order: 4 },
            { name: "מיץ לימון", amount: "2", unit: "כפות", order: 5 },
            { name: "מלח ופלפל", amount: "", unit: "לפי הטעם", order: 6 },
          ],
        },
        steps: {
          create: [
            {
              title: "חיתוך הירקות",
              description: "חותכים את העגבניות, המלפפונים, הבצל והפלפל לקוביות קטנות.",
              time: 10,
              order: 0,
            },
            {
              title: "ערבוב ותיבול",
              description: "מעבירים לקערה, מוסיפים שמן זית, מיץ לימון, מלח ופלפל ומערבבים.",
              time: 2,
              order: 1,
            },
            {
              title: "הגשה",
              description: "מגישים מיד. הכי טעים טרי!",
              order: 2,
            },
          ],
        },
        tags: {
          create: [
            {
              tag: {
                connectOrCreate: {
                  where: { name: "טבעוני" },
                  create: { name: "טבעוני" },
                },
              },
            },
            {
              tag: {
                connectOrCreate: {
                  where: { name: "בריא" },
                  create: { name: "בריא" },
                },
              },
            },
          ],
        },
      },
    });
    console.log("נוצר מתכון דוגמה: סלט ירקות ישראלי");
  }

  console.log("Seed הושלם בהצלחה!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
