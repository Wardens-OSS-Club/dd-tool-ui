import React, { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/default.css"; // or choose another style

type AppCodeProps = {
  code: string;
  language: string;
};

export const AppCode = ({ code, language }: AppCodeProps) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <pre>
      <code className={language}>{code}</code>
    </pre>
  );
};
