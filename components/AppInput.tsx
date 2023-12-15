import React from "react";
import c from "classnames";

type AppInputProps = {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const AppInput = ({
  label,
  name,
  className,
  ...props
}: AppInputProps) => {
  return (
    <div className="mb-1">
      <label htmlFor="email" className="block text-sm font-semibold text-black">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={c(
          "mt-2 block w-full rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 font-semibold placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm text-black",
          className
        )}
        {...props}
      />
    </div>
  );
};
