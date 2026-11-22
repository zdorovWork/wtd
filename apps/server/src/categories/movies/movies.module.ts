import { Module } from "@nestjs/common";
import { MoviesController } from "./movies.controller";
import { MoviesRepository } from "./movies.repository";
import { MoviesQuestionsRepository } from "./movies-questions.repository";

@Module({
  controllers: [MoviesController],
  providers: [MoviesRepository, MoviesQuestionsRepository],
})
export class MoviesModule {}
