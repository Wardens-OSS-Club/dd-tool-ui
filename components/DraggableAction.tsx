import React, { useState, useEffect } from 'react';

interface DraggableActionProps {
  id: string;
  content: string;
  inputs: Array<{ name: string; type: string }>;
  onUpdateInputVariables?: (values: string[]) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onRemove?: () => void;
}

const DraggableAction: React.FC<DraggableActionProps> = ({ id, content, inputs, onDragStart, onRemove, onUpdateInputVariables }) => {

  const [inputValues, setInputValues] = useState<string[]>(Array(inputs.length).fill(''));

  useEffect(() => {
    onUpdateInputVariables?.(inputValues);
  }, [inputValues, onUpdateInputVariables]);

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
        backgroundColor: 'lightgray',
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
            top: '2px',
            right: '2px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            lineHeight: '20px',
            textAlign: 'center'
          }}
        >
          X
        </button>
      )}
      <div style={{marginBottom: '8px'}}>{content}</div>
      {inputs?.map((input, index) => (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }} key={index}>
          <label style={{ flex: 1, fontSize: '0.9em' }}>{input.name}:</label>
          <input 
            type="text" 
            value={inputValues[index] || ''} 
            onChange={(e) => handleInputChange(index, e.target.value)}
            style={{ flex: 2, padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}  // Improved input field styling
          />
        </div>
      ))}
    </div>
  );
};

export default DraggableAction;