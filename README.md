# המטבח של יפה

אתר מתכונים ביתי מלא הכולל אתר ציבורי ופאנל ניהול.

## טכנולוגיות

- **Next.js 15** (App Router) + TypeScript
- **TailwindCSS** - עיצוב RTL
- **PostgreSQL** (Neon) + **Prisma** ORM
- **Clerk** - אימות משתמשים
- **Recharts** - גרפים בדשבורד
- **Zod** + **React Hook Form** - ולידציה

## התקנה

### 1. התקנת תלויות

```bash
npm install
```

### 2. הגדרת משתני סביבה

צרו קובץ `.env.local` בתיקיית השורש:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
ADMIN_USER_IDS="user_xxx"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- **DATABASE_URL**: מחרוזת חיבור ל-Neon PostgreSQL. הירשמו ב-[neon.tech](https://neon.tech) וצרו פרויקט.
- **Clerk Keys**: הירשמו ב-[clerk.com](https://clerk.com), צרו application, והעתיקו את המפתחות.
- **ADMIN_USER_IDS**: לאחר הרשמה ב-Clerk, העתיקו את ה-User ID שלכם מהדשבורד של Clerk.

### 3. הגדרת מסד נתונים

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. הרצה

```bash
npm run dev
```

האתר יעלה בכתובת: [http://localhost:3000](http://localhost:3000)

## מבנה הפרויקט

```
app/
  page.tsx                  - עמוד הבית
  recipes/page.tsx          - רשימת מתכונים
  recipes/[slug]/page.tsx   - עמוד מתכון
  about/page.tsx            - אודות
  contact/page.tsx          - צור קשר
  admin/
    dashboard/page.tsx      - דשבורד ניהול
    recipes/page.tsx        - ניהול מתכונים
    recipes/new/page.tsx    - יצירת מתכון חדש
    recipes/[id]/edit/      - עריכת מתכון
    categories/page.tsx     - ניהול קטגוריות
  api/track/                - API מעקב צפיות
components/                 - רכיבי UI
lib/                        - פונקציות עזר ו-actions
prisma/                     - סכימת DB ו-seed
```

## איך להוסיף מתכון חדש

1. היכנסו לפאנל הניהול: `/admin`
2. לחצו על "מתכונים" בתפריט הצד
3. לחצו על "מתכון חדש"
4. מלאו את כל השדות: כותרת, תיאור, מרכיבים, שלבי הכנה וכו'
5. לחצו "צור אוטומטי" ליצירת slug
6. בחרו סטטוס "מפורסם" לפרסום מיידי, או "טיוטה" לשמירה
7. לחצו "צור מתכון"

## איך לבדוק שהצפיות עובדות

1. פתחו את האתר בדפדפן - צפייה באתר נרשמת
2. פתחו מתכון כלשהו - צפייה במתכון נרשמת
3. רענון עמוד תוך 24 שעות לא יספור צפייה נוספת
4. פתחו מדפדפן אחר (או חלון פרטי) - צפייה חדשה תירשם
5. בדקו את הדשבורד ב-`/admin/dashboard` לצפייה בנתונים

## פריסה (Vercel)

1. דחפו את הקוד ל-GitHub
2. חברו את ה-repo ב-[vercel.com](https://vercel.com)
3. הוסיפו את כל משתני הסביבה ב-Vercel
4. Vercel ירוץ אוטומטית `prisma generate` דרך ה-postinstall script
5. לאחר deploy ראשון, הריצו seed דרך terminal מקומי מחובר ל-DB

## קישורים קבועים

- **WhatsApp**: לחצו על כפתור WhatsApp הירוק באתר
- **Instagram**: [@yafa_gershon_](https://www.instagram.com/yafa_gershon_)
- **TikTok**: [@yafa_gershon_](https://www.tiktok.com/@yafa_gershon_)
