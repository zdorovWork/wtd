import type { Client } from "pg";

export const setActivityCount = async (
  client: Client,
  slug: string,
  count: number,
): Promise<void> => {
  await client.query(
    "UPDATE categories SET activity_count = $2 WHERE slug = $1",
    [slug, count],
  );
};
