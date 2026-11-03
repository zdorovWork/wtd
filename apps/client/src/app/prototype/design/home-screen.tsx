import type { Category, CategorySlug } from "@/data/types";
import { DetectiveDuck } from "./detective-duck";
import { categoryVisuals, SpeechBubble } from "./ui";

type HomeScreenProps = {
  categories: Category[];
  activityCounts: Record<CategorySlug, number>;
  onPickCategory: (category: CategorySlug) => void;
};

export const HomeScreen = ({
  categories,
  activityCounts,
  onPickCategory,
}: HomeScreenProps) => (
  <main className="flex flex-1 flex-col px-5 pt-6 pb-28">
    <header className="flex items-center justify-between">
      <span className="font-heading text-3xl font-bold tracking-tight">
        wtd<span className="text-beak">?</span>
      </span>
      <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold shadow-sticker-sm">
        what to do
      </span>
    </header>

    <section className="mt-6 flex flex-col items-center">
      <SpeechBubble tail="bottom" className="self-stretch">
        <p className="font-heading text-xl font-semibold">
          Hi, I'm Detective Duck!
        </p>
        <p className="mt-1 text-sm text-ink/70">
          Pick a category, answer a few questions, and I'll crack the case of
          what you should do next.
        </p>
      </SpeechBubble>
      <DetectiveDuck className="mt-4 w-48 motion-safe:animate-bob" />
    </section>

    <nav aria-labelledby="categories-heading" className="mt-6">
      <h2 id="categories-heading" className="font-heading text-2xl font-bold">
        Categories
      </h2>
      <ul className="mt-8 flex flex-col gap-9">
        {categories.map((category) => {
          const visual = categoryVisuals[category.slug];

          return (
            <li key={category.slug}>
              <button
                type="button"
                onClick={() => onPickCategory(category.slug)}
                className="group relative flex h-24 w-full items-center rounded-2xl border-2 border-ink bg-white pr-32 pl-5 text-left shadow-sticker transition active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak"
              >
                <span className="flex flex-col">
                  <span className="font-heading text-2xl font-bold">
                    {category.name}
                  </span>
                  <span className="text-sm font-semibold text-ink/60">
                    {activityCounts[category.slug]} activities
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute right-5 -top-7 grid h-28 w-22 rotate-6 place-items-center rounded-xl border-2 border-ink bg-linear-to-br text-5xl shadow-sticker-sm transition group-hover:rotate-0 group-hover:-translate-y-1 ${visual.gradient}`}
                >
                  {visual.emoji}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  </main>
);
