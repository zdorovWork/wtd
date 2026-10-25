import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { Activity, CategorySlug, Trait } from "./types.ts";

type CategoryDataAccess = {
  category: CategorySlug;
  getActivity: (slug: string) => Promise<Activity | null>;
  listSlugs: () => Promise<string[]>;
  getTraits: () => Promise<Trait[]>;
};

export const testActivityIntegrity = ({
  category,
  getActivity,
  listSlugs,
  getTraits,
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

    test(`every trait mark references an existing ${category} trait`, async () => {
      const traitIds = new Set((await getTraits()).map((trait) => trait.id));

      for (const activity of await getAllActivities()) {
        for (const traitId of Object.keys(activity.traitMarks)) {
          assert.ok(
            traitIds.has(traitId),
            `${activity.slug} marks "${traitId}"`,
          );
        }
      }
    });

    test(`every ${category} trait has at least one yes and one no activity`, async () => {
      const activities = await getAllActivities();

      for (const trait of await getTraits()) {
        const marks = activities.map(
          (activity) => activity.traitMarks[trait.id],
        );
        assert.ok(marks.includes("yes"), `nothing marks "${trait.id}" yes`);
        assert.ok(marks.includes("no"), `nothing marks "${trait.id}" no`);
      }
    });
  });
};
