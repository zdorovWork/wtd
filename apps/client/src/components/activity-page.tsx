import type { Metadata } from "next";
import type { Activity } from "@/data/types";

type ActivityDetail = {
  label: string;
  value: string;
};

type ActivityPageProps = {
  activity: Activity;
  categoryDetails: ActivityDetail[];
};

export const activityMetadata = (activity: Activity | null): Metadata => {
  if (!activity) return {};

  return {
    title: `${activity.title} · wtd`,
    description: activity.description,
  };
};

export const ActivityPage = ({
  activity,
  categoryDetails,
}: ActivityPageProps) => {
  const details: ActivityDetail[] = [
    { label: "Release year", value: String(activity.year) },
    { label: "Genres", value: activity.genres.join(", ") },
    ...categoryDetails,
  ];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{activity.title}</h1>
      <p>{activity.description}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        {details.map((detail) => (
          <div key={detail.label} className="contents">
            <dt className="font-medium">{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
};
