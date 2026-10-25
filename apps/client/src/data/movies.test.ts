import { testActivityIntegrity } from "./activity-integrity.testing.ts";
import { getMovie, getMovieTraits, listMovieSlugs } from "./movies.ts";

testActivityIntegrity({
  category: "movies",
  getActivity: getMovie,
  listSlugs: listMovieSlugs,
  getTraits: getMovieTraits,
});
