import Link from "next/link";

export default async function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="container-page text-center py-20">
        <h1 className="text-2xl font-bold text-stone-800 mb-4">התחברות</h1>
        <p className="text-stone-600 mb-4">
          מצב פיתוח - Clerk לא מוגדר. פאנל הניהול פתוח.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors"
        >
          כניסה לפאנל ניהול
        </Link>
      </div>
    );
  }

  const { SignIn } = await import("@clerk/nextjs");
  return (
    <div className="container-page flex items-center justify-center min-h-[60vh]">
      <SignIn />
    </div>
  );
}
