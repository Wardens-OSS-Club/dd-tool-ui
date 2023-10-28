import React, { useState } from 'react';

interface StateVariablesProps {
  onAddVariable: (name: string, value: string) => void;
  state: { [key: string]: string };
}

const StateVariables: React.FC<StateVariablesProps> = ({ onAddVariable, state }) => {
  const [variableName, setVariableName] = useState('');
  const [variableValue, setVariableValue] = useState('');

  const handleAddVariable = () => {
    if (variableName && variableValue) {
      onAddVariable(variableName, variableValue);
      setVariableName('');
      setVariableValue('');
    }
  };

  const renderStateVariables = () => {
    return Object.entries(state).map(([key, value]) => (
      <div key={key} style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '4px' }}>
        <strong>{key}:</strong> {value}
      </div>
    ));
  };

  return (
    <div style={{ padding: '8px', backgroundColor: 'lightgray', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ flex: 1, fontSize: '0.9em' }}>Variable Name:</label>
        <input 
          type="text"
          value={variableName}
          onChange={e => setVariableName(e.target.value)}
          style={{ flex: 2, padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ flex: 1, fontSize: '0.9em' }}>Variable Value:</label>
        <input 
          type="text"
          value={variableValue}
          onChange={e => setVariableValue(e.target.value)}
          style={{ flex: 2, padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <button onClick={handleAddVariable} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
        Add Variable
      </button>
      <div style={{ marginTop: '20px' }}>
        <h3>State Variables</h3>
        {renderStateVariables()}
      </div>
    </div>
  );
};

export default StateVariables;
