import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMovie, listMovieSlugs } from "@/data/movies";
import { ActivityDetails, activityMetadata } from "@/widgets/activity-details";

export const generateStaticParams = async () => {
  const slugs = await listMovieSlugs();

  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: PageProps<"/movies/[slug]">): Promise<Metadata> => {
  const { slug } = await params;

  return activityMetadata(await getMovie(slug));
};

const MoviePage = async ({ params }: PageProps<"/movies/[slug]">) => {
  const { slug } = await params;
  const movie = await getMovie(slug);

  if (!movie) notFound();

  return (
    <ActivityDetails
      activity={movie}
      categoryDetails={[
        { label: "Runtime", value: `${movie.runtimeMinutes} min` },
        { label: "Director", value: movie.director },
      ]}
    />
  );
};

export default MoviePage;
