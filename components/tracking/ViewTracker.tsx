"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  type: "site" | "recipe";
  recipeId?: string;
}

export default function ViewTracker({ type, recipeId }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const url =
      type === "site"
        ? "/api/track/site-view"
        : `/api/track/recipe-view?recipeId=${recipeId}`;

    fetch(url, { method: "POST" }).catch(() => {});
  }, [type, recipeId]);

  return null;
}
