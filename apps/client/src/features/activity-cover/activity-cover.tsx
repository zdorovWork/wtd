import type { Activity } from "@/data/types";
import { Cover } from "@/shared/components/cover";
import { categoryEmojis } from "./category-visuals";

type ActivityCoverProps = {
  activity: Activity;
  className?: string;
};

const coverGradients = [
  "from-sky-400 to-indigo-500",
  "from-emerald-400 to-teal-600",
  "from-amber-300 to-orange-500",
  "from-pink-400 to-purple-500",
  "from-lime-300 to-green-600",
  "from-rose-400 to-red-600",
];

const getCoverGradient = (slug: string) => {
  const hash = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return coverGradients[hash % coverGradients.length];
};

export const ActivityCover = ({ activity, className }: ActivityCoverProps) => (
  <Cover
    title={activity.title}
    emoji={categoryEmojis[activity.category]}
    gradientClassName={getCoverGradient(activity.slug)}
    className={className}
  />
);
