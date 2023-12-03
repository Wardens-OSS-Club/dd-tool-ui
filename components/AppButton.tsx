import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import c from "classnames";

type AppButtonProps = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const AppButton = ({ children, ...props }: AppButtonProps) => {
  return <button {...props}>{children}</button>;
};

export const AppDefaultButton = ({
  children,
  className = "",
  ...props
}: AppButtonProps) => {
  return (
    <AppButton
      className={c(
        "inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-primary bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm hover:border-primary-accent hover:bg-primary-accent focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:border-primary disabled:hover:bg-primary disabled:hover:text-white dark:focus:ring-white/80",
        className
      )}
      {...props}
    >
      {children}
    </AppButton>
  );
};

export const AppButtonDanger = ({
  children,
  className = "",
  ...props
}: AppButtonProps) => {
  return (
    <AppButton
      className={c(
        "inline-flex cursor-pointer items-center justify-center rounded-xl  px-3 py-2 text-xs font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-primary disabled:hover:text-white dark:focus:ring-white/80  bg-red-500 hover:bg-red-600 focus:ring-red-400/80",
        className
      )}
      {...props}
    >
      {children}
    </AppButton>
  );
};

export const AppButtonSuccess = ({
  children,
  className = "",
  ...props
}: AppButtonProps) => {
  return (
    <AppButton
      className={c(
        "inline-flex cursor-pointer items-center justify-center rounded-xl  px-3 py-2 text-xs font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-primary disabled:hover:text-white dark:focus:ring-white/80 bg-green-500 hover:bg-green-600 focus:ring-green-400/80",
        className
      )}
      {...props}
    >
      {children}
    </AppButton>
  );
};

export const AppButtonCancel = ({
  children,
  className = "",
  ...props
}: AppButtonProps) => {
  return (
    <AppButton
      className="inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-secondary bg-secondary px-3 py-2 text-xs font-semibold text-white shadow-sm hover:border-secondary-accent hover:bg-secondary-accent focus:outline-none focus:ring-2 focus:ring-primary/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:border-secondary disabled:hover:bg-secondary disabled:hover:text-white dark:focus:ring-white/80"
      {...props}
    >
      {children}
    </AppButton>
  );
};
