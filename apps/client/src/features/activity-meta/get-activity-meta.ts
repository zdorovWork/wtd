import type { Activity } from "@/data/types";

export const getActivityMeta = (activity: Activity) =>
  activity.category === "movies"
    ? `${activity.runtimeMinutes} min · ${activity.director}`
    : activity.platforms.join(" · ");
