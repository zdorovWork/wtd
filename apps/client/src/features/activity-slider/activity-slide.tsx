import Link from "next/link";
import type { Activity } from "@/data/types";
import { ActivityCover } from "@/features/activity-cover";
import { getActivityMeta } from "@/features/activity-meta";
import { GenreChips } from "@/shared/components/genre-chips";
import { Typography } from "@/shared/components/typography";

type ActivitySlideProps = {
  activity: Activity;
  index: number;
  total: number;
  isActive: boolean;
  onShow: () => void;
};

export const ActivitySlide = ({
  activity,
  index,
  total,
  isActive,
  onShow,
}: ActivitySlideProps) => (
  <li
    aria-roledescription="slide"
    aria-label={`${index + 1} of ${total}`}
    aria-current={isActive ? true : undefined}
    className={`relative w-[260px] shrink-0 snap-center transition duration-300 ${isActive ? "scale-100" : "scale-[0.86] opacity-60"}`}
  >
    <article className="overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-sticker">
      <div className="relative">
        <ActivityCover activity={activity} className="h-44" />
        <Typography
          as="span"
          size="sm"
          font="heading"
          weight="bold"
          className="absolute top-3 left-3 rounded-full border-2 border-ink bg-duck px-2.5 py-0.5"
        >
          #{index + 1}
        </Typography>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Typography as="p" size="xs" weight="bold" className="text-ink/60">
          {activity.year} · {getActivityMeta(activity)}
        </Typography>
        <GenreChips genres={activity.genres} />
        <Link
          href={`/${activity.category}/${activity.slug}`}
          tabIndex={isActive ? 0 : -1}
          aria-label={`Open ${activity.title}`}
          className="mt-1 rounded-xl border-2 border-ink bg-ink py-2 text-center font-heading font-semibold text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak"
        >
          View details
        </Link>
      </div>
    </article>
    {!isActive && (
      <button
        type="button"
        tabIndex={-1}
        aria-label={`Show ${activity.title}`}
        onClick={onShow}
        className="absolute inset-0 rounded-3xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak"
      />
    )}
  </li>
);
