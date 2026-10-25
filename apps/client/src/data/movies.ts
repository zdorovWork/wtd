import { movieTraits } from "../mocks/movie-traits.ts";
import { movies } from "../mocks/movies.ts";
import { findActivityBySlug, listActivitySlugs } from "./activities.ts";
import type { Movie, Trait } from "./types.ts";

export const getMovie = async (slug: string): Promise<Movie | null> =>
  findActivityBySlug(movies, slug);

export const listMovieSlugs = async (): Promise<string[]> =>
  listActivitySlugs(movies);

export const getMovieTraits = async (): Promise<Trait[]> => movieTraits;
