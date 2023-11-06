import React, { useState } from 'react';

// This is a simple component that accepts json abi

interface AbiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAbiSubmit: (abi: string, targetAddress: string) => void;
}

const AbiModal: React.FC<AbiModalProps> = ({ isOpen, onClose, onAbiSubmit }) => {
  const [abiInput, setAbiInput] = useState('');
  const [addressInput, setAddressInput] = useState('');

  const handleSubmit = () => {
    onAbiSubmit(abiInput, addressInput);
    onClose();
  };

  // Add some transition effects
  const modalTransitionStyle = {
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(-20px)'
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        visibility: isOpen ? 'visible' : 'hidden',
        ...modalTransitionStyle
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          width: '400px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          transform: 'translateY(0)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Enter Contract Details</h3>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Address:</label>
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>ABI:</label>
          <textarea 
            value={abiInput}
            onChange={(e) => setAbiInput(e.target.value)}
            rows={10}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              resize: 'vertical' // Allows the user to resize vertically
            }}
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <button 
            onClick={handleSubmit}
            style={{
              background: '#0052cc',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              marginRight: '10px',
              cursor: 'pointer',
              fontSize: '1em',
            }}
          >
            Submit
          </button>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#333',
              padding: '10px 20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1em',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbiModal;
