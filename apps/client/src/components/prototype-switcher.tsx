"use client";

import { useEffect } from "react";

export type PrototypeOption = {
  key: string;
  label: string;
};

type PrototypeSwitcherProps = {
  options: PrototypeOption[];
  currentKey: string;
  onChange: (key: string) => void;
};

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA"].includes(target.tagName));

const getKeyAtOffset = (
  options: PrototypeOption[],
  currentIndex: number,
  offset: number,
) => options[(currentIndex + offset + options.length) % options.length].key;

/** PROTOTYPE ONLY: never render in production. */
export const PrototypeSwitcher = ({
  options,
  currentKey,
  onChange,
}: PrototypeSwitcherProps) => {
  const currentIndex = Math.max(
    options.findIndex((option) => option.key === currentKey),
    0,
  );

  const selectByOffset = (offset: number) =>
    onChange(getKeyAtOffset(options, currentIndex, offset));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const offset = event.key === "ArrowLeft" ? -1 : 1;
      onChange(getKeyAtOffset(options, currentIndex, offset));
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, currentIndex, onChange]);

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-neutral-900 p-1 font-mono text-sm text-white shadow-2xl ring-2 ring-fuchsia-500">
      <button
        type="button"
        aria-label="Previous prototype screen"
        onClick={() => selectByOffset(-1)}
        className="grid size-9 place-items-center rounded-full hover:bg-white/15"
      >
        ←
      </button>
      <span className="min-w-52 text-center">
        {currentIndex + 1}/{options.length} · {options[currentIndex].label}
      </span>
      <button
        type="button"
        aria-label="Next prototype screen"
        onClick={() => selectByOffset(1)}
        className="grid size-9 place-items-center rounded-full hover:bg-white/15"
      >
        →
      </button>
    </div>
  );
};
