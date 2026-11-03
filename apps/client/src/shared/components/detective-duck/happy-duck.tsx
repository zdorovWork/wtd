import {
  Blush,
  Body,
  Cape,
  DuckFrame,
  Feet,
  Hat,
  HeadShape,
  Magnifier,
  OpenBeak,
  Shadow,
  Sparkle,
  Wing,
} from "./duck-parts";

type HappyDuckProps = {
  className?: string;
};

const confetti = [
  { x: 24, y: 40, fill: "var(--color-confetti-pink)", rotate: 20 },
  { x: 150, y: 14, fill: "var(--color-confetti-blue)", rotate: -30 },
  { x: 14, y: 150, fill: "var(--color-confetti-green)", rotate: 45 },
  { x: 186, y: 150, fill: "var(--color-confetti-pink)", rotate: -15 },
  { x: 44, y: 14, fill: "var(--color-confetti-yellow)", rotate: 60 },
];

export const HappyDuck = ({ className }: HappyDuckProps) => (
  <DuckFrame title="Detective duck, happy" className={className}>
    <Shadow scale={0.7} />
    {confetti.map((piece) => (
      <rect
        key={`${piece.x}-${piece.y}`}
        x={piece.x}
        y={piece.y}
        width={8}
        height={5}
        rx={1}
        fill={piece.fill}
        strokeWidth={2}
        transform={`rotate(${piece.rotate} ${piece.x + 4} ${piece.y + 2.5})`}
      />
    ))}
    <g transform="translate(0 -14)">
      <Feet />
      <Body />
      <HeadShape />
      <Cape />
      <OpenBeak />
      <path d="M82 78 Q90 68 98 78" fill="none" strokeWidth={5} />
      <Blush size={1.3} />
      <Hat transform="translate(6 -14) rotate(12 100 40)" />
      <Wing transform="translate(56 120) rotate(-55)" />
      <Magnifier transform="translate(172 68) rotate(44)" />
      <Wing transform="translate(162 114) rotate(60)" />
    </g>
    <Sparkle transform="translate(26 92) scale(0.7)" />
    <Sparkle transform="translate(184 26)" />
  </DuckFrame>
);
