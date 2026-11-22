import Link from "next/link";
import { type Category, isCategorySlug } from "@/data/types";
import { categoryEmojis } from "@/features/activity-cover/category-visuals";
import { Typography } from "@/shared/components/typography";
import { categoryGradients } from "./category-gradients";

type CategoryCardProps = {
  category: Category;
};

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const slug = category.slug;
  const sticker = isCategorySlug(slug)
    ? {
        emoji: categoryEmojis[slug],
        gradient: categoryGradients[slug],
      }
    : null;

  return (
    <Link
      href={`/quiz/${category.slug}`}
      className={`group relative flex h-24 w-full items-center rounded-2xl border-2 border-ink bg-white pl-5 text-left shadow-sticker transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak active:translate-x-1 active:translate-y-1 active:shadow-none ${sticker ? "pr-32" : "pr-5"}`}
    >
      <span className="flex flex-col">
        <Typography as="span" size="2xl" weight="bold" font="heading">
          {category.name}
        </Typography>
        <Typography
          as="span"
          size="sm"
          weight="semibold"
          className="text-ink/60"
        >
          {category.activityCount} activities
        </Typography>
      </span>
      {sticker ? (
        <span
          aria-hidden="true"
          className={`absolute -top-7 right-5 grid h-28 w-22 rotate-6 place-items-center rounded-xl border-2 border-ink bg-linear-to-br text-5xl shadow-sticker-sm transition group-hover:-translate-y-1 group-hover:rotate-0 ${sticker.gradient}`}
        >
          {sticker.emoji}
        </span>
      ) : null}
    </Link>
  );
};
