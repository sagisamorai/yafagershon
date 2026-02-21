const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function getAdminIds(): string[] {
  const ids = process.env.ADMIN_USER_IDS || "";
  return ids
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export async function isAdmin(): Promise<boolean> {
  if (!hasClerk) return true;
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return false;
  const adminIds = getAdminIds();
  if (adminIds.length === 0) return true;
  return adminIds.includes(userId);
}

export async function requireAdmin(): Promise<string> {
  if (!hasClerk) return "dev-admin";
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) throw new Error("לא מחובר");
  const adminIds = getAdminIds();
  if (adminIds.length > 0 && !adminIds.includes(userId)) {
    throw new Error("אין הרשאת מנהל");
  }
  return userId;
}
