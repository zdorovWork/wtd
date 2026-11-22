import { Module } from "@nestjs/common";
import { CategoriesModule } from "./categories/categories.module";
import { GamesModule } from "./categories/games/games.module";
import { MoviesModule } from "./categories/movies/movies.module";
import { PostgresModule } from "./postgres.module";

@Module({
  imports: [PostgresModule, CategoriesModule, GamesModule, MoviesModule],
})
export class AppModule {}
