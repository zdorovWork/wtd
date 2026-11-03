import Link from "next/link";
import type { Activity } from "@/data/types";
import { ActivitySlider } from "./activity-slider";
import { DetectiveDuck } from "./detective-duck";
import { FeedbackComment } from "./feedback-comment";
import {
  ActivityCover,
  GenreChips,
  getActivityHref,
  getActivityMeta,
  HomeIcon,
  primaryButtonClassName,
  ReplayIcon,
  SpeechBubble,
  secondaryButtonClassName,
} from "./ui";

const SingleActivityCard = ({ activity }: { activity: Activity }) => (
  <article className="overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-sticker">
    <ActivityCover activity={activity} className="h-52" />
    <div className="flex flex-col gap-3 p-5">
      <p className="text-sm font-bold text-ink/60">
        {activity.year} · {getActivityMeta(activity)}
      </p>
      <GenreChips genres={activity.genres} />
      <p className="line-clamp-3 text-sm text-ink/80">{activity.description}</p>
      <Link
        href={getActivityHref(activity)}
        aria-label={`Open ${activity.title}`}
        className="rounded-xl border-2 border-ink bg-ink py-2.5 text-center font-heading font-semibold text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak"
      >
        View details
      </Link>
    </div>
  </article>
);

type RecommendationScreenProps = {
  activities: Activity[];
  onHome: () => void;
  onPlayAgain: () => void;
  onKeepAsking: () => void;
};

export const RecommendationScreen = ({
  activities,
  onHome,
  onPlayAgain,
  onKeepAsking,
}: RecommendationScreenProps) => {
  const isSingle = activities.length === 1;

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-28">
      <section className="grid grid-cols-[34%_1fr] items-end gap-3">
        <DetectiveDuck
          mood="happy"
          className="w-full motion-safe:animate-bob"
        />
        <SpeechBubble tail="left" className="mb-6">
          <h1 className="font-heading text-xl leading-snug font-semibold">
            {isSingle ? "Case closed!" : "I've got my suspects!"}
          </h1>
          <p className="mt-1 text-sm text-ink/70">
            {isSingle
              ? "Elementary. This one fits you best:"
              : `${activities.length} activities match your clues. Swipe through them.`}
          </p>
        </SpeechBubble>
      </section>

      {isSingle ? (
        <SingleActivityCard activity={activities[0]} />
      ) : (
        <ActivitySlider activities={activities} />
      )}

      <button
        type="button"
        onClick={onKeepAsking}
        className="self-center text-sm font-bold underline decoration-2 underline-offset-4"
      >
        Not quite? Keep asking
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onHome}
          className={secondaryButtonClassName}
        >
          <HomeIcon />
          Home
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className={primaryButtonClassName}
        >
          <ReplayIcon />
          Again
        </button>
      </div>

      <FeedbackComment />
    </main>
  );
};
