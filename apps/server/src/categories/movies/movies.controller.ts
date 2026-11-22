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
import { QuestionsRepository } from "../../questions/questions.repository";
import { NextStepBodyDto } from "../../session/next-step.dto";
import {
  type NextStepResponse,
  presentNextStep,
} from "../../session/present-next-step";
import type { Movie } from "../../types";
import { MoviesRepository } from "./movies.repository";

@Controller("movies")
export class MoviesController {
  constructor(
    @Inject(MoviesRepository)
    private readonly movies: MoviesRepository,
    @Inject(QuestionsRepository)
    private readonly questions: QuestionsRepository,
  ) {}

  @Get("activities/:slug")
  async getActivity(@Param("slug") slug: string): Promise<Movie> {
    const movie = await this.movies.findBySlug(slug);
    if (!movie) {
      throw new NotFoundException();
    }

    return movie;
  }

  @Post("next-step")
  @HttpCode(200)
  async computeNextStep(
    @Body() body: NextStepBodyDto,
  ): Promise<NextStepResponse> {
    const [questions, activities] = await Promise.all([
      this.questions.listByCategory("movies"),
      this.movies.list(),
    ]);

    return presentNextStep(questions, activities, body);
  }
}
