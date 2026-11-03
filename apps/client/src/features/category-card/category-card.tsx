import Link from "next/link";
import type { Category } from "@/data/types";
import { categoryEmojis } from "@/features/activity-cover/category-visuals";
import { categoryGradients } from "./category-gradients";

type CategoryCardProps = {
  category: Category;
  activityCount: number;
};

export const CategoryCard = ({
  category,
  activityCount,
}: CategoryCardProps) => (
  <Link
    href={`/quiz/${category.slug}`}
    className="group relative flex h-24 w-full items-center rounded-2xl border-2 border-ink bg-white pr-32 pl-5 text-left shadow-sticker transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak active:translate-x-1 active:translate-y-1 active:shadow-none"
  >
    <span className="flex flex-col">
      <span className="font-heading text-2xl font-bold">{category.name}</span>
      <span className="text-sm font-semibold text-ink/60">
        {activityCount} activities
      </span>
    </span>
    <span
      aria-hidden="true"
      className={`absolute -top-7 right-5 grid h-28 w-22 rotate-6 place-items-center rounded-xl border-2 border-ink bg-linear-to-br text-5xl shadow-sticker-sm transition group-hover:-translate-y-1 group-hover:rotate-0 ${categoryGradients[category.slug]}`}
    >
      {categoryEmojis[category.slug]}
    </span>
  </Link>
);
