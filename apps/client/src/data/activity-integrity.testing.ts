import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { Activity, CategorySlug, Tag } from "./types.ts";

type CategoryDataAccess = {
  category: CategorySlug;
  getActivity: (slug: string) => Promise<Activity | null>;
  listSlugs: () => Promise<string[]>;
  getTags: () => Promise<Tag[]>;
};

export const testActivityIntegrity = ({
  category,
  getActivity,
  listSlugs,
  getTags,
}: CategoryDataAccess) => {
  const getAllActivities = async (): Promise<Activity[]> => {
    const slugs = await listSlugs();
    const activities = await Promise.all(slugs.map(getActivity));

    return activities.filter((activity) => activity !== null);
  };

  describe(`${category} data integrity`, () => {
    test("an unknown slug yields not-found", async () => {
      assert.equal(await getActivity("no-such-activity"), null);
    });

    test("slugs are unique", async () => {
      const slugs = await listSlugs();

      assert.ok(slugs.length > 0);
      assert.equal(new Set(slugs).size, slugs.length);
    });

    test(`every listed slug resolves to an activity in the ${category} category`, async () => {
      for (const slug of await listSlugs()) {
        const activity = await getActivity(slug);
        assert.equal(activity?.slug, slug);
        assert.equal(activity?.category, category);
      }
    });

    test(`every activity tag references an existing ${category} tag, once`, async () => {
      const tagIds = new Set((await getTags()).map((tag) => tag.id));

      for (const activity of await getAllActivities()) {
        assert.equal(
          new Set(activity.tags).size,
          activity.tags.length,
          `${activity.slug} repeats a tag`,
        );
        for (const tagId of activity.tags) {
          assert.ok(tagIds.has(tagId), `${activity.slug} has "${tagId}"`);
        }
      }
    });

    test(`every ${category} tag is held by some activities but not all`, async () => {
      const activities = await getAllActivities();

      for (const tag of await getTags()) {
        const holders = activities.filter((activity) =>
          activity.tags.includes(tag.id),
        );
        assert.ok(holders.length > 0, `nothing has "${tag.id}"`);
        assert.ok(
          holders.length < activities.length,
          `everything has "${tag.id}"`,
        );
      }
    });
  });
};
