import { notFound } from "next/navigation";
import { getCategories } from "@/data/categories";
import { getSessionData } from "@/data/sessions";
import { BackButton } from "@/features/back-button";
import { QuizSessionProvider, QuizStep } from "@/modules/quiz-session";
import { IconButton } from "@/shared/components/icon-button";
import { HomeIcon } from "@/shared/components/icons";
import { Pill } from "@/shared/components/pill";
import { AnswerList } from "@/widgets/answer-list";
import { QuestionPrompt } from "@/widgets/question-prompt";
import { RecommendationPanel } from "@/widgets/recommendation-panel";

export const generateStaticParams = async () => {
  const categories = await getCategories();

  return categories.map((category) => ({ category: category.slug }));
};

const SessionPage = async ({ params }: PageProps<"/quiz/[category]">) => {
  const { category } = await params;
  const [sessionData, categories] = await Promise.all([
    getSessionData(category),
    getCategories(),
  ]);
  const categoryName = categories.find(({ slug }) => slug === category)?.name;

  if (!sessionData || !categoryName) notFound();

  return (
    <QuizSessionProvider key={sessionData.category} sessionData={sessionData}>
      <main className="flex flex-1 flex-col px-5 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <QuizStep
          question={
            <>
              <header className="flex items-center justify-between">
                <BackButton />
                <Pill>{categoryName}</Pill>
                <IconButton label="Home" icon={<HomeIcon />} href="/" />
              </header>
              <QuestionPrompt />
              <AnswerList />
            </>
          }
          recommendation={<RecommendationPanel />}
        />
      </main>
    </QuizSessionProvider>
  );
};

export default SessionPage;
