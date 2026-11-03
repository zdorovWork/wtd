import Link from "next/link";
import type { ReactNode } from "react";

type IconButtonBaseProps = {
  label: string;
  icon: ReactNode;
};

type IconButtonLinkProps = IconButtonBaseProps & {
  href: string;
  onClick?: never;
};

type IconButtonActionProps = IconButtonBaseProps & {
  href?: never;
  onClick?: () => void;
};

type IconButtonProps = IconButtonLinkProps | IconButtonActionProps;

const className =
  "grid size-11 place-items-center rounded-full border-2 border-ink bg-white shadow-sticker-sm transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

export const IconButton = ({ label, icon, href, onClick }: IconButtonProps) => {
  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        {icon}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={className}
    >
      {icon}
    </button>
  );
};
