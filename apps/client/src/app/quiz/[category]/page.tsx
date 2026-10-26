import { notFound } from "next/navigation";
import { getCategories } from "@/data/categories";
import { getSessionData } from "@/data/sessions";
import { Session } from "./session";

export const generateStaticParams = async () => {
  const categories = await getCategories();

  return categories.map((category) => ({ category: category.slug }));
};

const SessionPage = async ({ params }: PageProps<"/quiz/[category]">) => {
  const { category } = await params;
  const sessionData = await getSessionData(category);

  if (!sessionData) notFound();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Answer a few questions</h1>
      <Session key={sessionData.category} sessionData={sessionData} />
    </main>
  );
};

export default SessionPage;
