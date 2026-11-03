import type { Activity } from "@/data/types";

type SliderDotsProps = {
  activities: Activity[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export const SliderDots = ({
  activities,
  activeIndex,
  onSelect,
}: SliderDotsProps) => (
  <div className="flex justify-center gap-2">
    {activities.map((activity, index) => {
      const isActive = index === activeIndex;
      const handleSelect = () => onSelect(index);

      return (
        <button
          key={activity.slug}
          type="button"
          aria-label={`Go to ${activity.title}`}
          aria-current={isActive ? true : undefined}
          onClick={handleSelect}
          className={`h-3 rounded-full border-2 border-ink transition-all focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak ${isActive ? "w-8 bg-beak" : "w-3 bg-white"}`}
        />
      );
    })}
  </div>
);
