import type { Client } from "pg";
import { setActivityCount } from "../categories/activity-count";

export const syncMoviesActivityCount = async (
  client: Client,
): Promise<void> => {
  const result = await client.query<{ count: number }>(
    "SELECT COUNT(*)::int AS count FROM movies",
  );

  await setActivityCount(client, "movies", result.rows[0]?.count ?? 0);
};
