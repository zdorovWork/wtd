import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getCategories } from "@/data/categories";
import { fetchNextStep } from "@/data/next-step";
import { ActivityWishModal } from "@/features/activity-wish-modal";
import { BackButton } from "@/features/back-button";
import { QuizSessionProvider, QuizStep } from "@/modules/quiz-session";
import { IconButton } from "@/shared/components/icon-button";
import { HomeIcon } from "@/shared/components/icons";
import { Pill } from "@/shared/components/pill";
import { AnswerList } from "@/widgets/answer-list";
import { QuestionPrompt } from "@/widgets/question-prompt";
import { RecommendationPanel } from "@/widgets/recommendation-panel";

export const instant = false;

const SessionPage = async ({ params }: PageProps<"/quiz/[category]">) => {
  await connection();
  const { category } = await params;
  const [initialStep, categories] = await Promise.all([
    fetchNextStep(category, { answers: [] }),
    getCategories(),
  ]);
  const selectedCategory = categories.find(({ slug }) => slug === category);

  if (!initialStep || !selectedCategory) notFound();

  const sessionChrome = (
    <header className="flex items-center justify-between">
      <BackButton />
      <Pill>{selectedCategory.name}</Pill>
      <IconButton label="Home" icon={<HomeIcon />} href="/" />
    </header>
  );

  return (
    <QuizSessionProvider
      key={selectedCategory.slug}
      category={selectedCategory.slug}
      initialStep={initialStep}
    >
      <main className="flex flex-1 flex-col px-5 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <QuizStep
          question={
            <>
              {sessionChrome}
              <QuestionPrompt />
              <AnswerList />
            </>
          }
          recommendation={<RecommendationPanel />}
          chrome={sessionChrome}
        />
        <ActivityWishModal />
      </main>
    </QuizSessionProvider>
  );
};

export default SessionPage;
