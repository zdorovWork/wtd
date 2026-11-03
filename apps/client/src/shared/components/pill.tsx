import { Typography } from "./typography";

type PillProps = {
  children: string;
};

export const Pill = ({ children }: PillProps) => (
  <div className="rounded-full border-2 border-ink bg-white px-4 py-1.5 shadow-sticker-sm">
    <Typography as="span" font="heading" weight="semibold">
      {children}
    </Typography>
  </div>
);
