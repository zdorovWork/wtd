import type { Category } from "./types.ts";

const parseCategory = (value: unknown): Category => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("slug" in value) ||
    !("name" in value) ||
    !("activityCount" in value) ||
    typeof value.slug !== "string" ||
    typeof value.name !== "string" ||
    typeof value.activityCount !== "number"
  ) {
    throw new Error("Invalid category from the server");
  }

  return {
    slug: value.slug,
    name: value.name,
    activityCount: value.activityCount,
  };
};

export const parseCategories = (payload: unknown): Category[] => {
  if (!Array.isArray(payload)) {
    throw new Error("Invalid category list from the server");
  }

  return payload.map(parseCategory);
};
