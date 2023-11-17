import React, { useState, useEffect } from 'react';

interface ComboBoxProps {
    options: string[];
    onChange: (value: string) => void;
    onBlur?: () => void;
    value: string;
}

const ComboBox: React.FC<ComboBoxProps> = ({ options, onChange, onBlur, value }) => {
  // Use state to manage the displayed value in the input
  const [displayValue, setDisplayValue] = useState(value.replace(/^\$/, ''));

  useEffect(() => {
    // Update displayValue when the value prop changes
    setDisplayValue(value.replace(/^\$/, ''));
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setDisplayValue(newValue);
    onChange(`$${newValue}`); // Add the $ symbol when passing the value to the onChange prop
  };

  return (
    <div style={{ position: 'relative' }}>
      <input 
        type="text" 
        value={displayValue} // Use displayValue for the input
        onChange={handleChange}
        onBlur={onBlur}
        list={options && options.length > 0 ? "combo-options" : undefined}
        style={{ flex: 2, padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
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
