import { testActivityIntegrity } from "./activity-integrity.testing.ts";
import { getGame, getGameTags, listGameSlugs } from "./games.ts";

testActivityIntegrity({
  category: "games",
  getActivity: getGame,
  listSlugs: listGameSlugs,
  getTags: getGameTags,
});
