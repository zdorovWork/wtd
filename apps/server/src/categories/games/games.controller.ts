import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { NextStepBodyDto } from "../../session/next-step.dto";
import {
  type NextStepResponse,
  presentNextStep,
} from "../../session/present-next-step";
import type { Game } from "../../types";
import { GamesRepository } from "./games.repository";
import { GamesQuestionsRepository } from "./games-questions.repository";

@Controller("games")
export class GamesController {
  constructor(
    @Inject(GamesRepository)
    private readonly games: GamesRepository,
    @Inject(GamesQuestionsRepository)
    private readonly questions: GamesQuestionsRepository,
  ) {}

  @Get("activities/:slug")
  async getActivity(@Param("slug") slug: string): Promise<Game> {
    const game = await this.games.findBySlug(slug);
    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }

  @Post("next-step")
  @HttpCode(200)
  async computeNextStep(
    @Body() body: NextStepBodyDto,
  ): Promise<NextStepResponse> {
    const [questions, activities] = await Promise.all([
      this.questions.list(),
      this.games.list(),
    ]);

    return presentNextStep(questions, activities, body);
  }
}
