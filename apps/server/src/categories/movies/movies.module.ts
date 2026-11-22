import { Module } from "@nestjs/common";
import { QuestionsRepository } from "../../questions/questions.repository";
import { MoviesController } from "./movies.controller";
import { MoviesRepository } from "./movies.repository";

@Module({
  controllers: [MoviesController],
  providers: [MoviesRepository, QuestionsRepository],
})
export class MoviesModule {}
