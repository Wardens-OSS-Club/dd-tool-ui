import React from 'react';
import { ethers } from 'ethers';

interface ResultDisplayProps {
  result: { [key: string]: any };
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    const itemStyle = {
        maxWidth: '1000px',
        background: '#f0f0f0', // Light gray background
        border: '1px solid #ddd', // Subtle border
        borderRadius: '4px', // Rounded corners
        padding: '10px', // Padding for some space inside
        margin: '5px 0', // Margin for space between items
        display: 'flex', // Flexbox for layout
        alignItems: 'center', // Align items vertically
        justifyContent: 'space-between', // Space between key and value
        color: '#333', // Darker text for readability
        fontSize: '14px', // Font size
        overflowWrap: 'break-word',
      };
    
      const keyStyle = {
        fontWeight: 'bold', // Bold font for keys
        marginRight: '10px', // Space after key
      };

      const boxStyle = {
        background: 'white', // Light gray background
        maxWidth: '1000px',
        overflowWrap: 'break-word',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      }

const renderValue = (value: any, parentKey = '') => {
    if (Array.isArray(value)) {
        return (
            <div style={{ marginLeft: '20px' }}>
              {value.map((item, index) => (
                <div key={`${parentKey}[${index}]`}>
                  {renderValue(item, `${parentKey}[${index}]`)}
                </div>
              ))}
            </div>
          );
        } else if (value && typeof value === 'object') {
          return (
            <div style={{ marginLeft: '20px' }}>
              {Object.entries(value).map(([key, val]) => (
                <div key={`${parentKey}.${key}`}>
                  <strong>{key}:</strong> {renderValue(val, `${parentKey}.${key}`)}
                </div>
              ))}
            </div>
          );
        }
    return <span>{ typeof value === "bigint" ? ethers.formatUnits(value, 0) : value}</span>;
  };

  return (
    <div style={boxStyle}>
      {Object.entries(result).map(([key, value]) => (
        <div key={key} style={itemStyle}>
          <span style={keyStyle}>{key}:</span>
          {renderValue(value, key)}
        </div>
      ))}
    </div>
  );
};

// 0x3472A5A71965499acd81997a54BBA8D852C6E53d
// 0xae78736Cd615f374D3085123A210448E74Fc6393

export default ResultDisplay;
