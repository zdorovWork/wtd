import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

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
  "flex items-center justify-center gap-2 rounded-2xl border-2 border-ink px-5 py-3.5 font-heading text-lg font-semibold shadow-sticker transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak active:translate-x-1 active:translate-y-1 active:shadow-none";

const variantClassNames: Record<ButtonVariant, string> = {
  primary: "bg-beak text-white",
  secondary: "bg-white text-ink",
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
