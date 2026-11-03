import {
  Blush,
  Body,
  Cape,
  ClosedBeak,
  color,
  DuckFrame,
  Feet,
  Hat,
  HeadShape,
  headingFont,
  Magnifier,
  Shadow,
  Wing,
} from "./duck-parts";

type ThinkingDuckProps = {
  className?: string;
};

const HEAD_TILT = "rotate(-8 100 110)";

export const ThinkingDuck = ({ className }: ThinkingDuckProps) => (
  <DuckFrame title="Detective duck, thinking" className={className}>
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
        <ellipse rx={8.5} ry={11.5} fill={color.ink} stroke="none" />
        <circle cx={3} cy={-5} r={3.4} fill={color.white} stroke="none" />
      </Magnifier>
    </g>
    <Wing transform="translate(122 128) rotate(-40)" />
    <Wing transform="translate(66 114) rotate(-35)" />
    <g fill={color.ink} stroke="none" fontWeight={700}>
      <text
        x={152}
        y={42}
        fontSize={36}
        transform="rotate(12 160 30)"
        fontFamily={headingFont}
      >
        ?
      </text>
      <text
        x={176}
        y={70}
        fontSize={22}
        transform="rotate(-10 180 62)"
        fontFamily={headingFont}
      >
        ?
      </text>
    </g>
  </DuckFrame>
);
