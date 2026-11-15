import { gameQuestions } from "../mocks/game-questions.ts";
import { movieQuestions } from "../mocks/movie-questions.ts";
import type { CategorySlug, Question, SessionData, Tag } from "./types.ts";

const questionsByCategory: Record<CategorySlug, Question[]> = {
  games: gameQuestions,
  movies: movieQuestions,
};

const isCategorySlug = (category: string): category is CategorySlug =>
  Object.hasOwn(questionsByCategory, category);

const tagsFromQuestions = (questions: Question[]): Tag[] => {
  const tags: Tag[] = [];
  const seen = new Set<string>();

  for (const question of questions) {
    if (seen.has(question.tagId)) continue;
    seen.add(question.tagId);
    tags.push({ id: question.tagId, label: question.tagId });
  }

  return tags;
};

const loadActivities = async (category: CategorySlug) => {
  if (category === "games") {
    const { getGame, listGameSlugs } = await import("./games.ts");
    const slugs = await listGameSlugs();
    const activities = await Promise.all(slugs.map(getGame));
    return activities.filter((activity) => activity !== null);
  }

  const { getMovie, listMovieSlugs } = await import("./movies.ts");
  const slugs = await listMovieSlugs();
  const activities = await Promise.all(slugs.map(getMovie));
  return activities.filter((activity) => activity !== null);
};

export const getSessionData = async (
  category: string,
): Promise<SessionData | null> => {
  if (!isCategorySlug(category)) return null;

  const questions = questionsByCategory[category];
  const session: SessionData = {
    category,
    tags: tagsFromQuestions(questions),
    questions,
    activities: await loadActivities(category),
  };

  return JSON.parse(JSON.stringify(session)) as SessionData;
};
