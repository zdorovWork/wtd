import { fetchServerApi } from "./server-api.ts";
import type { Category, CategorySlug } from "./types.ts";

const categorySlugs: CategorySlug[] = ["games", "movies"];

const isCategorySlug = (value: unknown): value is CategorySlug =>
  typeof value === "string" && categorySlugs.some((slug) => slug === value);

const parseCategory = (value: unknown): Category => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("slug" in value) ||
    !("name" in value) ||
    !isCategorySlug(value.slug) ||
    typeof value.name !== "string"
  ) {
    throw new Error("Invalid category from the server");
  }

  return { slug: value.slug, name: value.name };
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetchServerApi("/api/categories");
  if (!response.ok) {
    throw new Error(`Failed to load categories: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Invalid category list from the server");
  }

  return payload.map(parseCategory);
};
