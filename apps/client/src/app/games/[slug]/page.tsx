import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGame, listGameSlugs } from "@/data/games";

type GameDetail = {
  label: string;
  value: string;
};

export const generateStaticParams = async () => {
  const slugs = await listGameSlugs();

  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: PageProps<"/games/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) return {};

  return { title: `${game.title} · wtd`, description: game.description };
};

const GamePage = async ({ params }: PageProps<"/games/[slug]">) => {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) notFound();

  const details: GameDetail[] = [
    { label: "Release year", value: String(game.year) },
    { label: "Genres", value: game.genres.join(", ") },
    { label: "Platforms", value: game.platforms.join(", ") },
    { label: "Play modes", value: game.playModes.join(", ") },
  ];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{game.title}</h1>
      <p>{game.description}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        {details.map((detail) => (
          <div key={detail.label} className="contents">
            <dt className="font-medium">{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
};

export default GamePage;
