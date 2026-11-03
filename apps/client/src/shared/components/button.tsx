import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "option";

type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonLinkProps = ButtonBaseProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type ButtonActionProps = ButtonBaseProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
};

type ButtonProps = ButtonLinkProps | ButtonActionProps;

const baseClassName =
  "flex items-center gap-2 rounded-2xl border-2 border-ink px-5 py-3.5 font-heading text-lg font-semibold cursor-pointer transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak active:shadow-none";

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    "justify-center bg-beak text-white shadow-sticker active:translate-x-1 active:translate-y-1",
  secondary:
    "justify-center bg-white text-ink shadow-sticker active:translate-x-1 active:translate-y-1",
  option:
    "justify-start bg-white text-left text-ink shadow-sticker-sm hover:bg-duck/40 active:translate-x-0.5 active:translate-y-0.5",
};

export const Button = ({
  children,
  variant = "primary",
  className = "",
  href,
  onClick,
  type = "button",
}: ButtonProps) => {
  const classNames = `${baseClassName} ${variantClassNames[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classNames}>
      {children}
    </button>
  );
};
