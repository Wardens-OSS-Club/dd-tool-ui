// components/Canvas.tsx
import React, { useState } from 'react';
import DraggableAction from './DraggableAction';

interface Item {
  id: string;
  content: string;
  functionString: string;
  address: string;
  inputs: any[]
}

/** 
 * TO DO:
 * 1) DONE: Fix the dragging and reordering -> can't perfectly order atm
 * 2) Rework to receive json from dd-tool (context or props from a level above)
 * 3) Fix quirk of "VM Options" button, it's being overlaid by something
 * 4) ?
 */

// Useful later to extract the functions from the json provided by the dd-tool
function extractFunctionName(str: string): string | null {
    // Regular expression to find function name
    // It starts with the word "function", followed by spaces, then captures the function name and params
    const regex = /function\s+([a-zA-Z0-9_]+\([^)]*\))/;
    const match = str.match(regex);
  
    // If there's a match, it will be at index 1 due to the capture group in the regex
    return match ? match[1] : null;
  }
  

const PocCanvas: React.FC = () => {
    // We start with this one function as an example
    // Note: `items` is the array of instructions
    const [items, setItems] = useState<Item[]>([
        {
            id: "0",
            content: "getPricePerFullShare()",
            functionString: "function getPricePerFullShare() external view returns (uint256)",
            address: "0xBA485b556399123261a5F9c95d413B4f93107407",
            inputs: []
        }
    ]);
  
    // These are the VM custom instruction set
    // ? Do we hard code this, pull it from the dd tool?
    const customItems = [
      { id: 'custom-1', content: 'Prank', functionString: "INSERT the PRANK", inputs: [] },
      { id: 'custom-2', content: 'Deal', functionString: "INSERT the DEAL", inputs: [] },
      { id: 'custom-3', content: 'ExpectRevert', functionString: "INSERT the EXEPECTRERVERT", inputs: [] },
    ];

    // Setting up the external functions
    // This will usually be given by the json the dd-tool provides
    // TODO rework to get this from props or ? context
    const MOCK_CONTRACT = [
        {
            id: "0",
            content: "getPricePerFullShare()",
            functionString: "function getPricePerFullShare() external view returns (uint256)",
            address: "0xBA485b556399123261a5F9c95d413B4f93107407",
            inputs: []
        },
        {
            id: "1",
            content: "available()",
            functionString: "function available() external view returns (uint256)",
            address: "0xBA485b556399123261a5F9c95d413B4f93107407",
            inputs: []
        }
      ]
  
    const [showAddItem, setShowAddItem] = useState(false);
    const [showDefaultItems, setShowDefaultItems] = useState(false);  // New state for default items visibility
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
  
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
      e.dataTransfer.effectAllowed = 'move';
      setDraggedItem(id);
    };
  
    const handleDragEnd = () => {
      if (draggedItem !== null) {
        setItems(prevItems => prevItems.filter(item => item.id !== draggedItem));
        setDraggedItem(null);
      }
    };
  
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();

      if (!draggedItem) return;

      const draggedItemIndex = items.findIndex(item => item.id === draggedItem);
      if (draggedItemIndex === -1) return;

      const updatedItems = [...items];
      const [removed] = updatedItems.splice(draggedItemIndex, 1);
      updatedItems.splice(index, 0, removed);

      setItems(updatedItems);
      setDraggedItem(null);
  };
  
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };
  
    const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      
      if (!draggedItem) return;
  
      const allAvailableItems = [...MOCK_CONTRACT, ...customItems];
      const itemToAdd = allAvailableItems.find(item => item.id === draggedItem);
  
      if (!itemToAdd) return;
  
      // Since it's dropped on the canvas directly, simply add the item to the end of the items array
      const newItem = { ...itemToAdd, id: Date.now().toString() };
      setItems([...items, newItem]);
  
      setDraggedItem(null);
    };

    return (
      <div style={{ fontFamily: 'Roboto, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button style={buttonStyle} onClick={() => setShowAddItem(!showAddItem)}>VM Options</button>
          <button style={buttonStyle} onClick={() => setShowDefaultItems(!showDefaultItems)}>Contract Functions</button>
        </div>
        {/* Custom Items and Default Items styling */}
        {showAddItem && (
          <div style={{ ...boxStyle, backgroundColor: '#f2f2f2' }}>
            <h4>VM Options</h4>
            {customItems.map((item) => (
              <DraggableAction key={item.id} id={item.id} content={item.content} onDragStart={handleDragStart} />
            ))}
          </div>
        )}
        {showDefaultItems && (
            <div style={{ ...boxStyle, backgroundColor: '#e0e0e0' }}>
                <h4>Public Fxs</h4>
                {MOCK_CONTRACT.map((item) => (
                    <DraggableAction key={item.id} id={item.id} content={item.content} onDragStart={handleDragStart} />
                ))}
            </div>
        )}
  
        <h4>Drag and Build</h4>
        <div 
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ 
                minHeight: '100px', 
                width: '300px', 
                padding: '20px', 
                border: '2px dashed #cccccc',
                position: 'relative' 
            }}
        >          
        {items.map((item, index) => (
            <div
            key={item.id} 
            draggable 
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDrop={(e) => handleDrop(e, index)} 
            onDragOver={handleDragOver}
            style={{
                margin: '8px 0',
                padding: '8px',
                border: '1px solid #ccc',
                cursor: 'move'
            }}
        >
              <DraggableAction id={item.id} content={item.content} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
            </div>
          ))}
          <div 
                style={{ 
                    height: '100%', 
                    width: '100%', 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    zIndex: items.length === 0 ? 1 : -1 
                }} 
                onDrop={handleCanvasDrop} 
                onDragOver={(e) => e.preventDefault()}
            />
        </div>
        {/* Output items array */}
        <h4>Output</h4>
        <pre>
            {JSON.stringify(
                items.map(({ functionString, address, inputs }) => ({
                    functionString,
                    address,
                    inputs
                })),
                null,
                2
            )}
        </pre>
      </div>
    );
  };
  
  const buttonStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#333',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontWeight: 500,
    fontSize: '16px',
    outline: 'none'
  };
  
  const boxStyle = {
    width: '80%',
    padding: '16px',
    margin: '20px 0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  };

export default PocCanvas;
