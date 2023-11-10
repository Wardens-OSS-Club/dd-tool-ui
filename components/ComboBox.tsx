import React, { useState } from 'react';

interface ComboBoxProps {
    options: string[];
    onChange: (value: string) => void;
    onBlur?: () => void;
    value: string;
}

const ComboBox: React.FC<ComboBoxProps> = ({ options, onChange, onBlur, value }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input 
        type="text" 
        value={inputValue}
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