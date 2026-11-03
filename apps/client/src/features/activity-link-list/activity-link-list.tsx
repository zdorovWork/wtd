import Link from "next/link";
import type { Activity } from "@/data/types";

type ActivityLinkListProps = {
  activities: Activity[];
};

export const ActivityLinkList = ({ activities }: ActivityLinkListProps) => (
  <ol className="flex list-decimal flex-col gap-2 pl-6">
    {activities.map((activity) => (
      <li key={activity.slug}>
        <Link
          href={`/${activity.category}/${activity.slug}`}
          className="underline focus-visible:outline-2"
        >
          {activity.title}
        </Link>
      </li>
    ))}
  </ol>
);
