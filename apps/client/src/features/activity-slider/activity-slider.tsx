"use client";

import { useRef, useState } from "react";
import type { Activity } from "@/data/types";
import { ActivitySlide } from "./activity-slide";
import { SliderDots } from "./slider-dots";

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
    const scroller = scrollerRef.current;
    const slide = scroller?.children[index];
    if (!(slide instanceof HTMLElement) || !scroller) return;

    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    scroller.scrollTo({
      left: slideCenter - scroller.clientWidth / 2,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Recommended activities"
      className="-mx-5"
    >
      <ol
        ref={scrollerRef}
        onScroll={handleScroll}
        className="relative flex snap-x snap-mandatory gap-2 overflow-x-auto px-[calc(50%-130px)] py-4 [scrollbar-width:none]"
      >
        {activities.map((activity, index) => {
          const handleShow = () => scrollToSlide(index);

          return (
            <ActivitySlide
              key={activity.slug}
              activity={activity}
              index={index}
              total={activities.length}
              isActive={index === activeIndex}
              onShow={handleShow}
            />
          );
        })}
      </ol>
      <SliderDots
        activities={activities}
        activeIndex={activeIndex}
        onSelect={scrollToSlide}
      />
    </section>
  );
};
