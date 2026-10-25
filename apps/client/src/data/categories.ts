import { categories } from "../mocks/categories.ts";
import type { Category } from "./types.ts";

export const getCategories = async (): Promise<Category[]> => categories;
