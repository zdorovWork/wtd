import { movieTags } from "../mocks/movie-tags.ts";
import { movies } from "../mocks/movies.ts";
import { findActivityBySlug, listActivitySlugs } from "./activities.ts";
import type { Movie, Tag } from "./types.ts";

export const getMovie = async (slug: string): Promise<Movie | null> =>
  findActivityBySlug(movies, slug);

export const listMovieSlugs = async (): Promise<string[]> =>
  listActivitySlugs(movies);

export const getMovieTags = async (): Promise<Tag[]> => movieTags;
