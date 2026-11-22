import type { Client } from "pg";
import { setActivityCount } from "../activity-count";

export const syncGamesActivityCount = async (client: Client): Promise<void> => {
  const result = await client.query<{ count: number }>(
    "SELECT COUNT(*)::int AS count FROM games",
  );

  await setActivityCount(client, "games", result.rows[0]?.count ?? 0);
};
