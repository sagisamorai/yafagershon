import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0590-\u05FFa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function totalTime(prepTime: number, cookTime: number): number {
  return prepTime + cookTime;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} דקות`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return hours === 1 ? "שעה" : `${hours} שעות`;
  return `${hours === 1 ? "שעה" : `${hours} שעות`} ו-${mins} דקות`;
}

export function difficultyLabel(d: string): string {
  const map: Record<string, string> = {
    EASY: "קל",
    MEDIUM: "בינוני",
    HARD: "קשה",
  };
  return map[d] || d;
}

export function kashrutLabel(k: string): string {
  const map: Record<string, string> = {
    KOSHER: "כשר",
    NOT_KOSHER: "לא כשר",
    DAIRY: "חלבי",
    MEAT: "בשרי",
    PAREVE: "פרווה",
  };
  return map[k] || k;
}

export function statusLabel(s: string): string {
  const map: Record<string, string> = {
    DRAFT: "טיוטה",
    PUBLISHED: "מפורסם",
  };
  return map[s] || s;
}

export function getWhatsAppLink(): string {
  const phone = "972545286929";
  const message = encodeURIComponent("היי הגעתי דרך האתר מתכונים");
  return `https://wa.me/${phone}?text=${message}`;
}

export const INSTAGRAM_URL =
  "https://www.instagram.com/yafa_gershon_?igsh=MWx4YWg0dmY1d2xnaQ==";

export const TIKTOK_URL =
  "https://www.tiktok.com/@yafa_gershon_?_r=1&_t=ZS-946bcmIQzie";

export const ITEMS_PER_PAGE = 12;
