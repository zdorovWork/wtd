import Link from "next/link";
import type { ReactNode } from "react";
import type { Activity, CategorySlug } from "@/data/types";

type BubbleTail = "left" | "bottom";

type SpeechBubbleProps = {
  children: ReactNode;
  tail?: BubbleTail;
  className?: string;
};

const tailClassNames: Record<BubbleTail, string> = {
  left: "top-8 -left-[11px] border-b-2 border-l-2",
  bottom: "-bottom-[11px] left-10 border-r-2 border-b-2",
};

export const SpeechBubble = ({
  children,
  tail = "left",
  className = "",
}: SpeechBubbleProps) => (
  <div
    className={`relative rounded-3xl border-2 border-ink bg-white p-4 shadow-sticker ${className}`}
  >
    <span
      aria-hidden="true"
      className={`absolute size-5 rotate-45 border-ink bg-white ${tailClassNames[tail]}`}
    />
    <div className="relative">{children}</div>
  </div>
);

type CategoryVisual = {
  emoji: string;
  gradient: string;
};

export const categoryVisuals: Record<CategorySlug, CategoryVisual> = {
  games: { emoji: "🎮", gradient: "from-violet-500 to-fuchsia-400" },
  movies: { emoji: "🎬", gradient: "from-orange-500 to-rose-400" },
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

type ActivityCoverProps = {
  activity: Activity;
  className?: string;
};

export const ActivityCover = ({
  activity,
  className = "",
}: ActivityCoverProps) => (
  <div
    aria-hidden="true"
    className={`relative flex items-end overflow-hidden bg-linear-to-br p-3 ${getCoverGradient(activity.slug)} ${className}`}
  >
    <span className="absolute -top-2 -right-2 text-7xl opacity-30">
      {categoryVisuals[activity.category].emoji}
    </span>
    <span className="font-heading text-2xl leading-tight font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.35)]">
      {activity.title}
    </span>
  </div>
);

export const getActivityMeta = (activity: Activity) =>
  activity.category === "movies"
    ? `${activity.runtimeMinutes} min · ${activity.director}`
    : activity.platforms.join(" · ");

export const getActivityHref = (activity: Activity) =>
  `/${activity.category}/${activity.slug}`;

export const GenreChips = ({ genres }: { genres: string[] }) => (
  <ul className="flex flex-wrap gap-1.5">
    {genres.map((genre) => (
      <li
        key={genre}
        className="rounded-full border-2 border-ink bg-duck/60 px-2.5 py-0.5 text-xs font-bold"
      >
        {genre}
      </li>
    ))}
  </ul>
);

const iconButtonClassName =
  "grid size-11 place-items-center rounded-full border-2 border-ink bg-white shadow-sticker-sm transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak";

type IconButtonProps = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
};

export const IconButton = ({ label, icon, onClick, href }: IconButtonProps) => {
  if (href) {
    return (
      <Link href={href} aria-label={label} className={iconButtonClassName}>
        {icon}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={iconButtonClassName}
    >
      {icon}
    </button>
  );
};

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const ArrowLeftIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const HomeIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />
  </svg>
);

export const ReplayIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v5h5" />
  </svg>
);

export const SendIcon = () => (
  <svg {...iconProps} aria-hidden="true">
    <path d="M4 12l16-8-6 16-3-7z" />
  </svg>
);

export const primaryButtonClassName =
  "flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-beak px-5 py-3.5 font-heading text-lg font-semibold text-white shadow-sticker transition active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink";

export const secondaryButtonClassName =
  "flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white px-5 py-3.5 font-heading text-lg font-semibold shadow-sticker transition active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak";
