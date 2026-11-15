import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { GamesRepository } from "../activities/games.repository";
import { MoviesRepository } from "../activities/movies.repository";
import { getNextStep } from "../engine/recommendation";
import { QuestionsRepository } from "../questions/questions.repository";
import type { Activity, Question } from "../types";
import { CategoriesRepository } from "./categories.repository";
import type { NextStepBodyDto } from "./next-step.dto";

export type NextStepResponse =
  | {
      kind: "question";
      question: { id: string; text: string };
      answeredCount: number;
    }
  | { kind: "recommendation"; activities: Activity[] };

@Injectable()
export class NextStepService {
  constructor(
    @Inject(CategoriesRepository)
    private readonly categories: CategoriesRepository,
    @Inject(GamesRepository)
    private readonly games: GamesRepository,
    @Inject(MoviesRepository)
    private readonly movies: MoviesRepository,
    @Inject(QuestionsRepository)
    private readonly questions: QuestionsRepository,
  ) {}

  async compute(
    category: string,
    body: NextStepBodyDto,
  ): Promise<NextStepResponse> {
    if (!(await this.categories.exists(category))) {
      throw new NotFoundException();
    }

    if (category !== "games" && category !== "movies") {
      throw new NotFoundException();
    }

    const questions = await this.questions.listByCategory(category);
    const questionIds = new Set(questions.map((question) => question.id));
    const unknownQuestion = body.answers.find(
      (given) => !questionIds.has(given.questionId),
    );
    if (unknownQuestion) {
      throw new BadRequestException("Unknown question id");
    }

    const activities =
      category === "games" ? await this.games.list() : await this.movies.list();
    const step = getNextStep<Activity, Question>({
      activities,
      questions,
      answers: body.answers,
      rejectedAtCount: body.rejectedAtCount,
    });

    if (step.kind === "question") {
      return {
        kind: "question",
        question: { id: step.question.id, text: step.question.text },
        answeredCount: step.answeredCount,
      };
    }

    return { kind: "recommendation", activities: step.activities };
  }
}
