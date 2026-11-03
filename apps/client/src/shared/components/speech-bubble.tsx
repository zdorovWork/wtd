import type { ReactNode } from "react";

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
