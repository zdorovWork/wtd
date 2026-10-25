import type { Activity } from "./types.ts";

export const findActivityBySlug = <TActivity extends Activity>(
  activities: TActivity[],
  slug: string,
): TActivity | null =>
  activities.find((activity) => activity.slug === slug) ?? null;

export const listActivitySlugs = (activities: Activity[]): string[] =>
  activities.map((activity) => activity.slug);
