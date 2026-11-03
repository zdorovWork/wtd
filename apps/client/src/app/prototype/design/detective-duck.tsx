import type { ReactNode } from "react";

export type DuckMood = "idle" | "thinking" | "happy";

type DetectiveDuckProps = {
  mood?: DuckMood;
  className?: string;
};

const INK = "#2b2b2b";
const DUCK = "#ffd23f";
const BEAK = "#f7931e";
const HAT = "#a0703f";

type PartProps = {
  transform?: string;
};

type MagnifierProps = PartProps & {
  children?: ReactNode;
};

const Magnifier = ({ transform, children }: MagnifierProps) => (
  <g transform={transform}>
    <path d="M15 17 L32 46" fill="none" stroke="#4a3020" strokeWidth={9} />
    <circle r={22} fill="#cfe8f7" fillOpacity={0.75} strokeWidth={6} />
    {children}
    <path d="M-12 -8 Q-8 -17 2 -19" fill="none" stroke="#fff" />
  </g>
);

const Wing = ({ transform }: PartProps) => (
  <ellipse rx={16} ry={11} fill={DUCK} transform={transform} />
);

const Hat = ({ transform }: PartProps) => (
  <g transform={transform}>
    <path
      d="M68 52 Q68 18 100 16 Q134 16 134 52 Q100 42 68 52 Z"
      fill="#b5814a"
    />
    <path
      d="M68 46 Q100 36 134 46 L134 53 Q100 43 68 53 Z"
      fill="#4a3020"
      strokeWidth={3}
    />
    <path
      d="M48 56 Q100 34 154 56 Q158 66 144 64 Q100 46 58 66 Q44 64 48 56 Z"
      fill={HAT}
    />
  </g>
);

const Sparkle = ({ transform }: PartProps) => (
  <path
    d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z"
    fill={DUCK}
    strokeWidth={3}
    transform={transform}
  />
);

const Feet = () => (
  <>
    <path d="M80 190 L66 205 L98 205 Z" fill={BEAK} />
    <path d="M120 190 L112 205 L144 205 Z" fill={BEAK} />
  </>
);

const Body = () => (
  <>
    <path d="M150 128 L184 108 L172 156 Z" fill={DUCK} />
    <ellipse cx={110} cy={152} rx={60} ry={46} fill={DUCK} />
  </>
);

const HeadShape = () => <circle cx={100} cy={80} r={40} fill={DUCK} />;

const Cape = () => (
  <>
    <path
      d="M60 120 Q102 142 152 118 L164 154 Q134 172 110 150 Q84 170 56 154 Z"
      fill="#d9b48f"
    />
    <path d="M100 132 L92 160 M110 132 L118 160" fill="none" />
    <circle cx={105} cy={130} r={6} fill={HAT} />
  </>
);

const ClosedBeak = () => (
  <path d="M64 82 Q40 84 36 95 Q48 106 68 98 Z" fill={BEAK} />
);

const OpenBeak = () => (
  <>
    <ellipse cx={52} cy={96} rx={13} ry={8} fill="#7a2a1a" />
    <path d="M66 80 Q42 78 33 88 Q50 94 68 91 Z" fill={BEAK} />
    <path d="M66 97 Q50 99 40 104 Q53 113 69 104 Z" fill={BEAK} />
  </>
);

const OpenEye = () => (
  <>
    <ellipse cx={90} cy={76} rx={5.5} ry={7.5} fill={INK} stroke="none" />
    <circle cx={92} cy={72.5} r={2.2} fill="#fff" stroke="none" />
  </>
);

const Blush = ({ size = 1 }: { size?: number }) => (
  <ellipse
    cx={110}
    cy={93}
    rx={8 * size}
    ry={4.5 * size}
    fill="#ff8fa3"
    opacity={0.6}
    stroke="none"
  />
);

const Shadow = ({ scale = 1 }: { scale?: number }) => (
  <ellipse
    cx={105}
    cy={207}
    rx={62 * scale}
    ry={6 * scale}
    fill={INK}
    opacity={0.12 * scale}
    stroke="none"
  />
);

const IdleDuck = () => (
  <>
    <Shadow />
    <Feet />
    <Body />
    <HeadShape />
    <Cape />
    <ClosedBeak />
    <OpenEye />
    <path d="M70 104 Q76 108 82 105" fill="none" strokeWidth={3} />
    <Blush />
    <Hat />
    <Magnifier transform="translate(40 126)" />
    <Wing transform="translate(70 172) rotate(-25)" />
    <Wing transform="translate(156 90) rotate(-62) scale(1.15 1)" />
    <g fill="none" strokeWidth={3}>
      <path d="M170 58 Q182 66 182 80" />
      <path d="M178 46 Q194 58 194 80" />
    </g>
  </>
);

const HEAD_TILT = "rotate(-8 100 110)";

const ThinkingDuck = () => (
  <>
    <Shadow />
    <Feet />
    <Body />
    <g transform={HEAD_TILT}>
      <HeadShape />
    </g>
    <Cape />
    <g transform={HEAD_TILT}>
      <ClosedBeak />
      <Blush />
      <Hat />
      <Magnifier transform="translate(90 78) rotate(-12)">
        <ellipse rx={8.5} ry={11.5} fill={INK} stroke="none" />
        <circle cx={3} cy={-5} r={3.4} fill="#fff" stroke="none" />
      </Magnifier>
    </g>
    <Wing transform="translate(122 128) rotate(-40)" />
    <Wing transform="translate(66 114) rotate(-35)" />
    <g fill={INK} stroke="none" fontWeight={700}>
      <text
        x={152}
        y={42}
        fontSize={36}
        transform="rotate(12 160 30)"
        fontFamily="var(--font-fredoka), sans-serif"
      >
        ?
      </text>
      <text
        x={176}
        y={70}
        fontSize={22}
        transform="rotate(-10 180 62)"
        fontFamily="var(--font-fredoka), sans-serif"
      >
        ?
      </text>
    </g>
  </>
);

const confetti = [
  { x: 24, y: 40, color: "#f472b6", rotate: 20 },
  { x: 150, y: 14, color: "#60a5fa", rotate: -30 },
  { x: 14, y: 150, color: "#34d399", rotate: 45 },
  { x: 186, y: 150, color: "#f472b6", rotate: -15 },
  { x: 44, y: 14, color: "#fbbf24", rotate: 60 },
];

const HappyDuck = () => (
  <>
    <Shadow scale={0.7} />
    {confetti.map((piece) => (
      <rect
        key={`${piece.x}-${piece.y}`}
        x={piece.x}
        y={piece.y}
        width={8}
        height={5}
        rx={1}
        fill={piece.color}
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
  </>
);

const duckByMood: Record<DuckMood, () => ReactNode> = {
  idle: IdleDuck,
  thinking: ThinkingDuck,
  happy: HappyDuck,
};

export const DetectiveDuck = ({
  mood = "idle",
  className,
}: DetectiveDuckProps) => {
  const Duck = duckByMood[mood];

  return (
    <svg
      viewBox="-6 -12 212 227"
      className={className}
      role="img"
      aria-label={`Detective duck, ${mood}`}
    >
      <title>{`Detective duck, ${mood}`}</title>
      <g
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <Duck />
      </g>
    </svg>
  );
};
