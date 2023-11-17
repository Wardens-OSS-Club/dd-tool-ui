import React, { useState, useEffect } from 'react';
import ComboBox from './ComboBox';

interface DraggableActionProps {
  id: string;
  content: string;
  inputs: Array<{ name: string; type: string }>;
  onUpdateInputVariables?: (values: string[]) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onRemove?: () => void;
  onAddToCanvas?: () => void;
  options?: string[];
}

const DraggableAction: React.FC<DraggableActionProps> = ({ id, content, inputs, options, onDragStart, onRemove, onUpdateInputVariables, onAddToCanvas }) => {

  const [inputValues, setInputValues] = useState<string[]>(Array(inputs.length).fill(''));

  const handleInputChange = (index: number, value: string) => {
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = value;
    setInputValues(updatedInputValues);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      style={{
        padding: '8px',
        margin: '4px',
        backgroundColor: '#E1EBEC',
        position: 'relative',
        borderRadius: '5px',  // Added rounded corners for a modern look
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'  // Added subtle shadow for depth
      }}
    >
    {onRemove && (
      <button
        onClick={onRemove}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'linear-gradient(145deg, #f3456f, #c0392b)', // Gradient background
          color: 'white',
          border: 'none',
          borderRadius: '15px', // Rounded corners but not a full circle
          width: '15px', // Slightly larger button for a clearer icon
          height: '15px',
          cursor: 'pointer',
          fontSize: '16px', // Larger font size for the icon
          lineHeight: '15px', // Center the line height with the height of the button
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
          transition: 'all 0.3s ease', // Smooth transition for hover effects
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'; // Grow the button on hover
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; // Deeper shadow on hover
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)'; // Button returns to original size
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'; // Shadow returns to original
        }}
      >
        &times; {/* Multiplication sign (×) used as a "close" icon */}
      </button>
    )}
    {onAddToCanvas && (
      <button 
        onClick={onAddToCanvas}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'linear-gradient(145deg, #28a745, #218838)', // A green gradient background
          color: 'white',
          border: 'none',
          borderRadius: '15px', // Smooth rounded corners
          width: '15px', // Slightly larger for a clearer '+' sign
          height: '15px',
          cursor: 'pointer',
          fontSize: '16px', // A larger font size for the '+' sign
          lineHeight: '15px', // Center the '+' sign vertically
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
          transition: 'all 0.3s ease', // Smooth transition for hover effects
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'; // Button grows on hover for feedback
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; // Deeper shadow on hover
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)'; // Button returns to original size
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'; // Shadow returns to original
        }}
      >
        &#43; {/* Unicode character for '+' sign */}
      </button>
    )}


      <div style={{marginBottom: '8px'}}>{content}</div>
      {inputs?.map((input, index) => (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }} key={index}>
          <label style={{ flex: 1, fontSize: '0.9em' }}>{input.name}:</label>
          <ComboBox 
            value={inputValues[index] || ''} 
            onChange={(value) => handleInputChange(index, value)}
            onBlur={() => onUpdateInputVariables?.(inputValues)}
            options = {options}

          />
        </div>
      ))}
    </div>
  );
};

export default DraggableAction;