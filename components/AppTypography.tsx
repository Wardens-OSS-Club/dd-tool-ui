import React from "react";
import c from "classnames";

interface AppH1Props {
  children: React.ReactNode;
  className?: string;
}

export const AppH1: React.FC<AppH1Props> = ({ children, className = "" }) => (
  <h1 className={c("text-3xl font-bold text-gray-800", className)}>
    {children}
  </h1>
);

interface AppH2Props {
  children: React.ReactNode;
  className?: string;
}

export const AppH2: React.FC<AppH2Props> = ({ children, className = "" }) => (
  <h2 className={c("text-2xl font-semibold text-gray-700", className)}>
    {children}
  </h2>
);

export const AppH3: React.FC<AppH2Props> = ({ children, className = "" }) => (
  <h3 className={c("text-xl font-semibold text-gray-700", className)}>
    {children}
  </h3>
);

export const AppH4: React.FC<AppH2Props> = ({ children, className = "" }) => (
  <h4 className={c("text-lg font-semibold text-gray-700", className)}>
    {children}
  </h4>
);

interface AppPProps {
  children: React.ReactNode;
  className?: string;
}

export const AppP: React.FC<AppPProps> = ({ children, className = "" }) => (
  <p className={c("text-base text-gray-600", className)}>{children}</p>
);
