import { Module } from "@nestjs/common";
import { GamesController } from "./games.controller";
import { GamesRepository } from "./games.repository";
import { GamesQuestionsRepository } from "./games-questions.repository";

@Module({
  controllers: [GamesController],
  providers: [GamesRepository, GamesQuestionsRepository],
})
export class GamesModule {}
