import { Module } from "@nestjs/common";
import { CategoriesModule } from "./categories/categories.module";
import { PostgresModule } from "./postgres.module";

@Module({
  imports: [PostgresModule, CategoriesModule],
})
export class AppModule {}
