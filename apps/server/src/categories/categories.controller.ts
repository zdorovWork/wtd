import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { GamesRepository } from "../activities/games.repository";
import { MoviesRepository } from "../activities/movies.repository";
import type { Activity, Category } from "../types";
import { CategoriesRepository } from "./categories.repository";

@Controller("categories")
export class CategoriesController {
  constructor(
    @Inject(CategoriesRepository)
    private readonly categories: CategoriesRepository,
    @Inject(GamesRepository)
    private readonly games: GamesRepository,
    @Inject(MoviesRepository)
    private readonly movies: MoviesRepository,
  ) {}

  @Get()
  list(): Promise<Category[]> {
    return this.categories.list();
  }

  @Get(":category/activities")
  async listActivitySlugs(
    @Param("category") category: string,
  ): Promise<string[]> {
    if (!(await this.categories.exists(category))) {
      throw new NotFoundException();
    }

    if (category === "games") {
      return this.games.listSlugs();
    }

    if (category === "movies") {
      return this.movies.listSlugs();
    }

    throw new NotFoundException();
  }

  @Get(":category/activities/:slug")
  async getActivity(
    @Param("category") category: string,
    @Param("slug") slug: string,
  ): Promise<Activity> {
    if (!(await this.categories.exists(category))) {
      throw new NotFoundException();
    }

    if (category === "games") {
      const game = await this.games.findBySlug(slug);
      if (!game) {
        throw new NotFoundException();
      }

      return game;
    }

    if (category === "movies") {
      const movie = await this.movies.findBySlug(slug);
      if (!movie) {
        throw new NotFoundException();
      }

      return movie;
    }

    throw new NotFoundException();
  }
}
