import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityPage, activityMetadata } from "@/components/activity-page";
import { getGame, listGameSlugs } from "@/data/games";

export const generateStaticParams = async () => {
  const slugs = await listGameSlugs();

  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: PageProps<"/games/[slug]">): Promise<Metadata> => {
  const { slug } = await params;

  return activityMetadata(await getGame(slug));
};

const GamePage = async ({ params }: PageProps<"/games/[slug]">) => {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) notFound();

  return (
    <ActivityPage
      activity={game}
      categoryDetails={[
        { label: "Platforms", value: game.platforms.join(", ") },
        { label: "Play modes", value: game.playModes.join(", ") },
      ]}
    />
  );
};

export default GamePage;
