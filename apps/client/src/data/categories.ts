import { connection } from "next/server";
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
  await connection();

  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    throw new Error("SERVER_URL is missing");
  }

  const response = await fetch(new URL("/api/categories", serverUrl));
  if (!response.ok) {
    throw new Error(`Failed to load categories: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Invalid category list from the server");
  }

  return payload.map(parseCategory);
};
