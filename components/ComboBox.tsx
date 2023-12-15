import React, { useState, useEffect } from "react";

interface ComboBoxProps {
  options: string[] | undefined;
  onChange: (value: string) => void;
  onBlur?: () => void;
  value: string;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  onChange,
  onBlur,
  value,
}) => {
  // Use state to manage the displayed value in the input
  const [displayValue, setDisplayValue] = useState(value.replace(/^\$/, ""));

  useEffect(() => {
    // Update displayValue when the value prop changes
    if (value.startsWith("#")) {
      setDisplayValue(value.replace(/^\#/, ""));
    } else if (value.startsWith("$")) {
      setDisplayValue(value.replace(/^\$/, ""));
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setDisplayValue(newValue);
    if (newValue.startsWith("#")) {
      onChange(newValue);
    } else {
      onChange(`$${newValue}`); // Add the $ symbol when passing the value to the onChange prop
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={displayValue} // Use displayValue for the input
        onChange={handleChange}
        onBlur={onBlur}
        list={options && options.length > 0 ? "combo-options" : undefined}
        className="mt-2 block w-full rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 font-semibold placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm text-black bg-white"
      />
      {options && options.length > 0 && (
        <datalist id="combo-options">
          {options.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      )}
    </div>
  );
};

export default ComboBox;
