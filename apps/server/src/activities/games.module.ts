import { Module } from "@nestjs/common";
import { QuestionsRepository } from "../questions/questions.repository";
import { GamesController } from "./games.controller";
import { GamesRepository } from "./games.repository";

@Module({
  controllers: [GamesController],
  providers: [GamesRepository, QuestionsRepository],
})
export class GamesModule {}
