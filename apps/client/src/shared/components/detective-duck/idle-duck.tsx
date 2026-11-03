import {
  Blush,
  Body,
  Cape,
  ClosedBeak,
  DuckFrame,
  Feet,
  Hat,
  HeadShape,
  Magnifier,
  OpenEye,
  Shadow,
  Wing,
} from "./duck-parts";

type IdleDuckProps = {
  className?: string;
};

export const IdleDuck = ({ className }: IdleDuckProps) => (
  <DuckFrame title="Detective duck, idle" className={className}>
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
  </DuckFrame>
);
