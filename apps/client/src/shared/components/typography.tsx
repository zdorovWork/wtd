import type { ElementType, ReactNode, Ref } from "react";

type TypographyTag = "p" | "span" | "h1" | "h2" | "h3" | "legend";
type TypographySize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
type TypographyWeight = "regular" | "semibold" | "bold";
type TypographyFont = "heading" | "body";
type TypographyColor = "ink" | "muted" | "white" | "duck" | "beak";
type TypographyAlign = "left" | "center" | "right";

type TypographyProps = {
  children: ReactNode;
  as?: TypographyTag;
  size?: TypographySize;
  weight?: TypographyWeight;
  font?: TypographyFont;
  color?: TypographyColor;
  align?: TypographyAlign;
  className?: string;
  id?: string;
  tabIndex?: number;
  ref?: Ref<HTMLElement>;
};

const sizeClassNames: Record<TypographySize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl leading-snug",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

const weightClassNames: Record<TypographyWeight, string> = {
  regular: "font-normal",
  semibold: "font-semibold",
  bold: "font-bold",
};

const fontClassNames: Record<TypographyFont, string> = {
  heading: "font-heading",
  body: "font-body",
};

const colorClassNames: Record<TypographyColor, string> = {
  ink: "text-ink",
  muted: "text-ink/70",
  white: "text-white",
  duck: "text-duck",
  beak: "text-beak",
};

const alignClassNames: Record<TypographyAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const Typography = ({
  children,
  as = "p",
  size = "base",
  weight = "regular",
  font = "body",
  color = "ink",
  align,
  className = "",
  ...elementProps
}: TypographyProps) => {
  const Tag = as as ElementType;
  const classNames = [
    sizeClassNames[size],
    weightClassNames[weight],
    fontClassNames[font],
    colorClassNames[color],
    align ? alignClassNames[align] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classNames} {...elementProps}>
      {children}
    </Tag>
  );
};
