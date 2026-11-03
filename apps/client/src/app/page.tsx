import { notFound } from "next/navigation";
import { getCategories } from "@/data/categories";
import { getSessionData } from "@/data/sessions";
import { CategoryCard } from "@/features/category-card";
import { IdleDuck } from "@/shared/components/detective-duck";
import { SpeechBubble } from "@/shared/components/speech-bubble";

const HomePage = async () => {
  const categories = await getCategories();
  const sessions = await Promise.all(
    categories.map((category) => getSessionData(category.slug)),
  );

  if (sessions.some((session) => !session)) notFound();

  return (
    <main className="flex flex-1 flex-col px-5 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
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
        <IdleDuck className="mt-4 w-48 motion-safe:animate-bob" />
      </section>

      <nav aria-labelledby="categories-heading" className="mt-6">
        <h2 id="categories-heading" className="font-heading text-2xl font-bold">
          Categories
        </h2>
        <ul className="mt-8 flex flex-col gap-9">
          {categories.map((category, index) => (
            <li key={category.slug}>
              <CategoryCard
                category={category}
                activityCount={sessions[index]?.activities.length ?? 0}
              />
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
};

export default HomePage;
