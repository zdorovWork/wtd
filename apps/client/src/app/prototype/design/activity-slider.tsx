"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Activity } from "@/data/types";
import {
  ActivityCover,
  GenreChips,
  getActivityHref,
  getActivityMeta,
} from "./ui";

type ActivitySliderProps = {
  activities: Activity[];
};

export const ActivitySlider = ({ activities }: ActivitySliderProps) => {
  const scrollerRef = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    const slides = [...scroller.children] as HTMLElement[];
    const distances = slides.map((slide) =>
      Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - scrollerCenter),
    );

    setActiveIndex(distances.indexOf(Math.min(...distances)));
  };

  const scrollToSlide = (index: number) => {
    const slide = scrollerRef.current?.children[index];
    slide?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Recommended activities"
    >
      <ol
        ref={scrollerRef}
        onScroll={handleScroll}
        className="relative -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-[calc(50%-110px)] py-4 [scrollbar-width:none]"
      >
        {activities.map((activity, index) => {
          const isActive = index === activeIndex;

          return (
            <li
              key={activity.slug}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${activities.length}`}
              aria-current={isActive}
              className={`relative w-[260px] shrink-0 snap-center transition duration-300 ${isActive ? "scale-100" : "scale-[0.86] opacity-60"}`}
            >
              <article className="overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-sticker">
                <div className="relative">
                  <ActivityCover activity={activity} className="h-44" />
                  <span className="absolute top-3 left-3 rounded-full border-2 border-ink bg-duck px-2.5 py-0.5 font-heading text-sm font-bold">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <p className="text-xs font-bold text-ink/60">
                    {activity.year} · {getActivityMeta(activity)}
                  </p>
                  <GenreChips genres={activity.genres} />
                  <Link
                    href={getActivityHref(activity)}
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
                  aria-label={`Show ${activity.title}`}
                  onClick={() => scrollToSlide(index)}
                  className="absolute inset-0 rounded-3xl"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex justify-center gap-2">
        {activities.map((activity, index) => (
          <button
            key={activity.slug}
            type="button"
            aria-label={`Go to ${activity.title}`}
            aria-current={index === activeIndex}
            onClick={() => scrollToSlide(index)}
            className={`h-3 rounded-full border-2 border-ink transition-all ${index === activeIndex ? "w-8 bg-beak" : "w-3 bg-white"}`}
          />
        ))}
      </div>
    </section>
  );
};
