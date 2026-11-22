import { Controller, Get, Inject } from "@nestjs/common";
import type { Category } from "../types";
import { CategoriesRepository } from "./categories.repository";

@Controller("categories")
export class CategoriesController {
  constructor(
    @Inject(CategoriesRepository)
    private readonly categories: CategoriesRepository,
  ) {}

  @Get()
  list(): Promise<Category[]> {
    return this.categories.list();
  }
}
