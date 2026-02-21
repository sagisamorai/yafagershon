"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="ניווט עמודים">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-lg hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none"
        aria-label="עמוד הבא"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      {start > 1 && (
        <>
          <button onClick={() => goToPage(1)} className="px-3 py-1 rounded-lg hover:bg-stone-100 text-sm">1</button>
          {start > 2 && <span className="px-2 text-stone-400">...</span>}
        </>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={cn(
            "px-3 py-1 rounded-lg text-sm font-medium",
            page === currentPage ? "bg-primary-600 text-white" : "hover:bg-stone-100 text-stone-700"
          )}
        >
          {page}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-stone-400">...</span>}
          <button onClick={() => goToPage(totalPages)} className="px-3 py-1 rounded-lg hover:bg-stone-100 text-sm">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-lg hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none"
        aria-label="עמוד קודם"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </nav>
  );
}
