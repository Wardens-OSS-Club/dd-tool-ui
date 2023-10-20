// components/PocCanvas.tsx
import React, { useState, useEffect } from 'react';
import DraggableAction from './DraggableAction';
import { runSequence } from 'dd-tool-package';

const RPC_URL = "https://mainnet.infura.io/v3/5b6375646612417cb32cc467e0ef8724";

interface Item {
  id: string;
  content: string;
  functionString: string;
  address: string;
  inputs: Input[];
  inputVariables?: VariableInput[];
  onRemove?: () => void; 
}

interface VariableInput {
  name: string;
  type: string;
  variableInput: string;
}

interface Input {
  name: string;
  type: string;
}

// Extra interface for DDToolItems in the format the tool requires
interface DDToolItem {
  call: {
    callInfo: {
      value: null;
      gasLimit: null;
      from: string;
    };
    contract: {
      functionString: string;
      address: string;
    };
    inputs: Input[];
  };
  outputMappings: string[];
  inputMappings: string[];
}

/** 
 * TO DO:
 * 1) DONE: Fix the dragging and reordering -> can't perfectly order atm
 * 2) Rework to receive json from dd-tool (context or props from a level above)
 * 3) DONE: Fix quirk of "VM Options" button, it's being overlaid by something
 * 4) Prob need to get some user flow done too for proper UX
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
    // Note: `items` is the array of instructions being constructed
    const [items, setItems] = useState<Item[]>([
        {
            id: "0",
            content: "getPricePerFullShare()",
            functionString: "function getPricePerFullShare() external view returns (uint256)",
            address: "0xBA485b556399123261a5F9c95d413B4f93107407",
            inputs: [],
            inputVariables: []
        }
    ]);
  
    // These are the VM custom instruction set
    // ? Do we hard code this, pull it from the dd tool?
    const customItems = [
      { id: 'custom-1', content: 'Prank', functionString: "INSERT the PRANK", inputs: [{name: "Address", type:"address"}], inputVariables:[] },
      { id: 'custom-2', content: 'Deal', functionString: "INSERT the DEAL", inputs: [{name: "Target", type:"address"}, {name:"Amount", type:"uint256"}] },
      { id: 'custom-3', content: 'ExpectRevert', functionString: "INSERT the EXEPECTRERVERT", inputs: [] },
    ];

    // Setting up the external functions
    // This will usually be given by the json the dd-tool provides
    // TODO rework to get this from props or ? context
    // This can be passed in from the dd-tool, but want to show more options for now
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
    
    // Because the items from the ABI != what we need for DD-tool
    // We convert with this utility 
    const transformItems = (oldItems: Item[]): DDToolItem[] => {
        return oldItems.map((item) => ({
          call: {
            callInfo: {
              value: null,
              gasLimit: null,
              from: item.address,
            },
            contract: {
              functionString: item.functionString,
              address: item.address,
            },
            inputs: item.inputs,  // You might need to map inputVariables into the appropriate structure here
          },
          outputMappings: ["balance"], // This is hardcoded for now, adjust according to your needs
          inputMappings: [], // Similarly, adjust according to your needs
        }));
      };

    // Let's run the DD tool
    // This function calls `runSequence` on the imported dd-tool
    const executeSequence = async () => {
      const newItems: DDToolItem[] = transformItems(items);
      const g = await runSequence(newItems, RPC_URL, { alwaysFundCaller: true });
      console.log("g", g);
    }

    // Handlers for the draggable elements
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
  
      const inputVariables: VariableInput[] = itemToAdd.inputs.map(input => ({
          name: input.name,
          type: input.type,
          variableInput: ''  // Ensuring that variableInput is being set properly
      }));
  
      const newItem: Item = {
          ...itemToAdd,
          id: Date.now().toString(),
          inputVariables  // Add the initialized inputVariables to the new item
      };
  
      setItems(prev => [...prev, newItem]);
      setDraggedItem(null);
  };

    useEffect(() => {
      console.log('Items state updated:', items);
  }, [items]);

  const handleUpdateInputVariables = (itemId: string, inputValues: string[]) => {
    console.log('handleUpdateInputVariables inputValues:', inputValues);  // Log for debugging
    setItems(prevItems => {
        const updatedItems = [...prevItems];
        const item = updatedItems.find(item => item.id === itemId);
        if (!item) return prevItems;

        if (!item.inputVariables || item.inputVariables.length === 0) {
            item.inputVariables = inputValues.map((value, index) => ({
                name: item.inputs[index].name,
                type: item.inputs[index].type,
                variableInput: value
            }));
        } else {
            inputValues.forEach((value, index) => {
                if (value === undefined) {
                    console.error('Value is undefined at index:', index);
                    return;
                }
                if (item.inputVariables[index]) {
                    item.inputVariables[index].variableInput = value;
                }
            });
        }
        return updatedItems;
    });
};

    const handleRemoveItem = (itemId: string) => {
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };


    return (
      <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', height: '100vh' }}>
      <div style={{ width: '40%', borderRight: '1px solid #ccc', padding: '20px', boxSizing: 'border-box' }}>
          
          <div style={{ marginBottom: '30px' }}>
              <h2>VM Options</h2>
              <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                  {customItems.map((item) => (
                      <DraggableAction key={item.id} id={item.id} content={item.content} inputs={item.inputs || []} onUpdateInputVariables={(inputValues) => handleUpdateInputVariables(item.id, inputValues)} onDragStart={handleDragStart} />
                  ))}
              </div>
          </div>
          
          <div>
              <h2>Contract Functions</h2>
              <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                  {MOCK_CONTRACT.map((item) => (
                      <DraggableAction key={item.id} id={item.id} content={item.content} inputs={item.inputs || []} onUpdateInputVariables={(inputValues) => handleUpdateInputVariables(item.id, inputValues)} onDragStart={handleDragStart} />
                  ))}
              </div>
          </div>
      </div>

      <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <h4>Drag and Drop</h4>
          <br/>
          <div 
              onDrop={handleCanvasDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{ 
                  minHeight: '100px', 
                  border: '2px dashed #cccccc',
                  borderRadius: '5px',
                  padding: '20px',
                  backgroundColor: '#f9f9f9',
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
          <DraggableAction 
            id={item.id} 
            content={item.content} 
            inputs={item.inputs || []} 
            onUpdateInputVariables={(inputValues) => handleUpdateInputVariables(item.id, inputValues)} 
            onDragStart={handleDragStart}
            onRemove={() => handleRemoveItem(item.id)}  // pass the handleRemoveItem function here
          />
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
        {/* Temp output items array */}
        <br></br>
        <h4>Output</h4>
        <br></br>
        <pre>
            {JSON.stringify(
                items.map(({ functionString, address, inputs, inputVariables }) => ({
                    functionString,
                    address,
                    inputs,
                    inputVariables
                })),
                null,
                2
            )}
        </pre>
        {/** We just want a quick way to run the current stack of items */}
        <button onClick={executeSequence} style={{ marginTop: '20px', padding: '10px', fontSize: '1em' }}>
          Execute Sequence
        </button>
      </div>
    </div>
    );
  };

export default PocCanvas;
