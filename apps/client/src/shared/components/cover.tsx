type CoverProps = {
  title: string;
  emoji: string;
  gradientClassName: string;
  className?: string;
};

export const Cover = ({
  title,
  emoji,
  gradientClassName,
  className = "",
}: CoverProps) => (
  <div
    aria-hidden="true"
    className={`relative flex items-end overflow-hidden bg-linear-to-br p-3 ${gradientClassName} ${className}`}
  >
    <span className="absolute -top-2 -right-2 text-7xl opacity-30">
      {emoji}
    </span>
    <span className="font-heading text-2xl leading-tight font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.35)]">
      {title}
    </span>
  </div>
);
