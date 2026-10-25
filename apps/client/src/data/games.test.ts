import { testActivityIntegrity } from "./activity-integrity.testing.ts";
import { getGame, getGameTraits, listGameSlugs } from "./games.ts";

testActivityIntegrity({
  category: "games",
  getActivity: getGame,
  listSlugs: listGameSlugs,
  getTraits: getGameTraits,
});
