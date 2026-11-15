import { parseMovie, parseSlugList } from "./parse-activity.ts";
import { fetchCachedServerApi } from "./server-api.ts";
import type { Movie } from "./types.ts";

export const getMovie = async (slug: string): Promise<Movie | null> => {
  const { status, body } = await fetchCachedServerApi(
    `/api/categories/movies/activities/${encodeURIComponent(slug)}`,
  );
  if (status === 404) return null;
  if (status !== 200) {
    throw new Error(`Failed to load movie: ${status}`);
  }

  return parseMovie(body);
};

export const listMovieSlugs = async (): Promise<string[]> => {
  const { status, body } = await fetchCachedServerApi(
    "/api/categories/movies/activities",
  );
  if (status !== 200) {
    throw new Error(`Failed to load movie slugs: ${status}`);
  }

  return parseSlugList(body);
};
