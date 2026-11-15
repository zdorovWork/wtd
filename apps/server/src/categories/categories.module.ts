import { Module } from "@nestjs/common";
import { GamesRepository } from "../activities/games.repository";
import { MoviesRepository } from "../activities/movies.repository";
import { QuestionsRepository } from "../questions/questions.repository";
import { CategoriesController } from "./categories.controller";
import { CategoriesRepository } from "./categories.repository";
import { NextStepService } from "./next-step.service";

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesRepository,
    GamesRepository,
    MoviesRepository,
    QuestionsRepository,
    NextStepService,
  ],
})
export class CategoriesModule {}
