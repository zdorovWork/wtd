import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoriesRepository } from "./categories.repository";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesRepository],
})
export class CategoriesModule {}
