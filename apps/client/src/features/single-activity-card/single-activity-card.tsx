import Link from "next/link";
import type { Activity } from "@/data/types";
import { ActivityCover } from "@/features/activity-cover";
import { getActivityMeta } from "@/features/activity-meta";
import { GenreChips } from "@/shared/components/genre-chips";
import { Typography } from "@/shared/components/typography";

type SingleActivityCardProps = {
  activity: Activity;
};

export const SingleActivityCard = ({ activity }: SingleActivityCardProps) => (
  <article className="overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-sticker">
    <ActivityCover activity={activity} className="h-52" />
    <div className="flex flex-col gap-3 p-5">
      <Typography as="p" size="sm" weight="bold" className="text-ink/60">
        {activity.year} · {getActivityMeta(activity)}
      </Typography>
      <GenreChips genres={activity.genres} />
      <Typography as="p" size="sm" className="line-clamp-3 text-ink/80">
        {activity.description}
      </Typography>
      <Link
        href={`/${activity.category}/${activity.slug}`}
        aria-label={`Open ${activity.title}`}
        className="rounded-xl border-2 border-ink bg-ink py-2.5 text-center font-heading font-semibold text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak"
      >
        View details
      </Link>
    </div>
  </article>
);
