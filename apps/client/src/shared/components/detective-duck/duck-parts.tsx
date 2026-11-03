import type { ReactNode } from "react";

type PartProps = {
  transform?: string;
};

type MagnifierProps = PartProps & {
  children?: ReactNode;
};

type BlushProps = {
  size?: number;
};

type ShadowProps = {
  scale?: number;
};

type DuckFrameProps = {
  title: string;
  className?: string;
  children: ReactNode;
};

export const color = {
  ink: "var(--color-ink)",
  duck: "var(--color-duck)",
  beak: "var(--color-beak)",
  hat: "var(--color-hat)",
  cape: "var(--color-cape)",
  lens: "var(--color-lens)",
  bark: "var(--color-bark)",
  straw: "var(--color-straw)",
  mouth: "var(--color-mouth)",
  blush: "var(--color-blush)",
  white: "#fff",
};

export const headingFont = "var(--font-fredoka), sans-serif";

export const DuckFrame = ({ title, className, children }: DuckFrameProps) => (
  <svg viewBox="-6 -12 212 227" className={className} role="img">
    <title>{title}</title>
    <g
      stroke={color.ink}
      strokeWidth={4}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {children}
    </g>
  </svg>
);

export const Magnifier = ({ transform, children }: MagnifierProps) => (
  <g transform={transform}>
    <path d="M15 17 L32 46" fill="none" stroke={color.bark} strokeWidth={9} />
    <circle r={22} fill={color.lens} fillOpacity={0.75} strokeWidth={6} />
    {children}
    <path d="M-12 -8 Q-8 -17 2 -19" fill="none" stroke={color.white} />
  </g>
);

export const Wing = ({ transform }: PartProps) => (
  <ellipse rx={16} ry={11} fill={color.duck} transform={transform} />
);

export const Hat = ({ transform }: PartProps) => (
  <g transform={transform}>
    <path
      d="M68 52 Q68 18 100 16 Q134 16 134 52 Q100 42 68 52 Z"
      fill={color.straw}
    />
    <path
      d="M68 46 Q100 36 134 46 L134 53 Q100 43 68 53 Z"
      fill={color.bark}
      strokeWidth={3}
    />
    <path
      d="M48 56 Q100 34 154 56 Q158 66 144 64 Q100 46 58 66 Q44 64 48 56 Z"
      fill={color.hat}
    />
  </g>
);

export const Sparkle = ({ transform }: PartProps) => (
  <path
    d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z"
    fill={color.duck}
    strokeWidth={3}
    transform={transform}
  />
);

export const Feet = () => (
  <>
    <path d="M80 190 L66 205 L98 205 Z" fill={color.beak} />
    <path d="M120 190 L112 205 L144 205 Z" fill={color.beak} />
  </>
);

export const Body = () => (
  <>
    <path d="M150 128 L184 108 L172 156 Z" fill={color.duck} />
    <ellipse cx={110} cy={152} rx={60} ry={46} fill={color.duck} />
  </>
);

export const HeadShape = () => (
  <circle cx={100} cy={80} r={40} fill={color.duck} />
);

export const Cape = () => (
  <>
    <path
      d="M60 120 Q102 142 152 118 L164 154 Q134 172 110 150 Q84 170 56 154 Z"
      fill={color.cape}
    />
    <path d="M100 132 L92 160 M110 132 L118 160" fill="none" />
    <circle cx={105} cy={130} r={6} fill={color.hat} />
  </>
);

export const ClosedBeak = () => (
  <path d="M64 82 Q40 84 36 95 Q48 106 68 98 Z" fill={color.beak} />
);

export const OpenBeak = () => (
  <>
    <ellipse cx={52} cy={96} rx={13} ry={8} fill={color.mouth} />
    <path d="M66 80 Q42 78 33 88 Q50 94 68 91 Z" fill={color.beak} />
    <path d="M66 97 Q50 99 40 104 Q53 113 69 104 Z" fill={color.beak} />
  </>
);

export const OpenEye = () => (
  <>
    <ellipse cx={90} cy={76} rx={5.5} ry={7.5} fill={color.ink} stroke="none" />
    <circle cx={92} cy={72.5} r={2.2} fill={color.white} stroke="none" />
  </>
);

export const Blush = ({ size = 1 }: BlushProps) => (
  <ellipse
    cx={110}
    cy={93}
    rx={8 * size}
    ry={4.5 * size}
    fill={color.blush}
    opacity={0.6}
    stroke="none"
  />
);

export const Shadow = ({ scale = 1 }: ShadowProps) => (
  <ellipse
    cx={105}
    cy={207}
    rx={62 * scale}
    ry={6 * scale}
    fill={color.ink}
    opacity={0.12 * scale}
    stroke="none"
  />
);
