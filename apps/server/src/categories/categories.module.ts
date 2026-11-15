import { Module } from "@nestjs/common";
import { GamesRepository } from "../activities/games.repository";
import { MoviesRepository } from "../activities/movies.repository";
import { CategoriesController } from "./categories.controller";
import { CategoriesRepository } from "./categories.repository";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesRepository, GamesRepository, MoviesRepository],
})
export class CategoriesModule {}
