import { parseCategories } from "./parse-categories.ts";
import { fetchServerApi } from "./server-api.ts";
import type { Category } from "./types.ts";

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetchServerApi("/api/categories");
  if (!response.ok) {
    throw new Error(`Failed to load categories: ${response.status}`);
  }

  return parseCategories(await response.json());
};
