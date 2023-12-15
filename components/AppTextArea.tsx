import React from "react";

type AppTextAreaProps = {
  label: string;
  name: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AppTextArea = ({ label, name, ...props }: AppTextAreaProps) => {
  return (
    <div className="mb-1">
      <label htmlFor="email" className="block text-sm font-semibold text-black">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className="mt-2 block w-full rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 font-semibold placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm h-[300px] text-black"
        {...props}
      />
    </div>
  );
};
