import { testActivityIntegrity } from "./activity-integrity.testing.ts";
import { getMovie, getMovieTags, listMovieSlugs } from "./movies.ts";

testActivityIntegrity({
  category: "movies",
  getActivity: getMovie,
  listSlugs: listMovieSlugs,
  getTags: getMovieTags,
});
