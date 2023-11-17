// components/PocCanvas.tsx
import React, { useState, useEffect } from 'react';
import DraggableAction from './DraggableAction';
import VariableInput from './StateVariables';
import { runSequence } from 'dd-tool-package';
import StateVariables from './StateVariables';
import AbiModal from './AbiModal';
import { ethers } from 'ethers';
import ResultDisplay from './ResultDisplay';

const RPC_URL = "https://mainnet.infura.io/v3/5b6375646612417cb32cc467e0ef8724";

// Items are placed in the execution array
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
  value: string;
}

interface Input {
  name: string;
  type: string;
}

// Extra interface for DDToolItems in the format the tool requires
// There is a conversion from Items to DDToolItems
type DDToolItem = {
  call: {
    callInfo: {
      value: null | string,
      gasLimit: null | string,
      from: string,
    },
    contract: {
      functionString: string,
      address: string,
    },
    inputs: any[],
  },
  outputMappings: string[],
  inputMappings: VariableInput[],
};

/** 
 * TO DO:
    1) Convert from state to ethers
    2) Clean up Inputs vs VariableInputs (only need one)
    3) Safe defaults
 */

const PocCanvas: React.FC = () => {
    // We start with this one function as an example
    // Note: `items` is the array of instructions being constructed
    // TO DO: Replace with safe default
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

    // DD-tool requires state to be passed to it
    const [state, setState] = useState({});
    const [result, setResult] = useState([]);
    const [inputOptions, setInputOptions] = useState<any[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };
    
    // Helper to add custom variable to state
    const handleAddVariable = (name: string, value: string) => {
    setState(prev => ({ ...prev, [name]: value }));
    console.log("State in canvas: ", state);
    };
  
    // These are the VM custom instruction set
    // TODO: either add these to the dd-tool side, or create a file
    const customItems = [
      { id: 'custom-1', content: 'Prank', functionString: "INSERT the PRANK", inputs: [{name: "Address", type:"address"}], inputVariables:[] },
      { id: 'custom-2', content: 'Deal', functionString: "INSERT the DEAL", inputs: [{name: "Target", type:"address"}, {name:"Amount", type:"uint256"}] },
      { id: 'custom-3', content: 'ExpectRevert', functionString: "INSERT the EXPECTREVERT", inputs: [] },
    ];

    // Setting up the external functions
    // This will usually be given by the json the dd-tool provides
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
      },
      {
        id: "2",
        content: "balanceOf()",
        functionString: "function balanceOf(address account) external view returns (uint256)",
        address: "0xBA485b556399123261a5F9c95d413B4f93107407",
        inputs: [{name:"Account", type:"address"}]
      },
      {
        id: "3",
        content: "getPoolId()",
        functionString: "function getPoolId() external view returns (bytes32)",
        address: "0x1ee442b5326009bb18f2f472d3e0061513d1a0ff",
        inputs: []
      },
      {
        id: "4",
        content: "getPoolTokens()",
        functionString: "function getPoolTokens(bytes32 poolId) external view returns (address[],uint256[],uint256 lastChangeBlock)",
        address: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        inputs: [{name:"PoolId", type:"bytes32"}]
      },
    ]

    // ABI importing and parsing
    const [importedAbi, setImportedAbi] = useState(MOCK_CONTRACT);
    const [isAbiModalOpen, setAbiModalOpen] = useState(false);

    // Accept and convert json abi to 
    const handleAbiSubmit = (abi: string, targetAddress: string) => {
      try {
        const iface = new ethers.Interface(abi);
        const parsedValues: any[] = parseAbiFunctions(iface.format(true), iface, targetAddress);
        setImportedAbi(parsedValues);
        console.log(parsedValues);
      } catch (error) {
        console.error('Invalid ABI');
      }
    };
    
    function parseAbiFunctions(abiArray: any[], iface: ethers.Interface, targetAddress: string) {
      let i: number = 0;
      return abiArray
        .filter((item) => item.startsWith('function')) // Only keep items that are functions
        .map((funcString) => {
          // Extract the function name and parameters
          const content = funcString.substring(9, funcString.indexOf('(')).trim();
          // We incr the id to assist with unique id gen
          i++;
          // Build and return the object
          return {
            id: (Date.now()+i).toString(), // ID generation logic: timestamp + i
            content,
            functionString: funcString,
            address: targetAddress, // Address should be provided here
            inputs: iface.getFunction(funcString)?.inputs
          };
        });
    }

    // Helper to generate outputMappings
    function createOutputMappings(functionString: string, content: string): string[] {
      const match = functionString.match(/returns\s*\(([^)]+)\)/);
      if (match && match[1]) {
        return match[1].split(',')
          .map((_, index) => `${content}-var${index + 1}`);
      }
      return [];
    }

    // Because the items from the ABI != what we need for DD-tool
    // We convert with this utility 
    const transformItems = (items: any[], state: { [key: string]: any }): DDToolItem[] => {
      return items.map(item => {
        // Parsing the amount of elements in the `returns ()` statement
        // Then simply creating a state var
        const outputs = item.functionString.match(/returns \(([^)]+)\)/);
        let outputMappings = [];
        if (outputs && outputs[1]) {
          outputMappings = outputs[1].split(',').map((_: string, index: number) => `${item.content}-var${index + 1}`);
        }
    
        return {
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
            inputs: [], // Assuming inputs will be handled elsewhere or are not needed for this use case
          },
          outputMappings, // @ts-ignore
          inputMappings: item.inputVariables.map(inputVar => {
            console.log("Input Vars: ", inputVar)
            const isState = inputVar.value.startsWith('$');
            const isVar = inputVar.value.startsWith('#');
            //const isCustom = inputVar.value.startsWith("custom :");
            //const customValue = isCustom ? inputVar.value.slice(8) : undefined;
            const stateValue = isVar ? state[inputVar.value] : undefined;
            console.log("state value: ", stateValue);

            return {
              type: stateValue !== undefined ? "concrete" : (isState ? "state" : "concrete"),
              name: inputVar.name,
              value: stateValue !== undefined ? stateValue : (isState ? inputVar.value.slice(1) : inputVar.value),
            }
          }),
        };
      });
    };

    // Let's run the DD tool
    // This function calls `runSequence` on the imported dd-tool
    const executeSequence = async () => {
      const newItems: DDToolItem[] = transformItems(items, state);
      console.log("Transformed Item Stack", newItems);
      console.log("STATE IN CANVAS: ", state);
      const g = await runSequence(newItems, RPC_URL, { alwaysFundCaller: true });
      console.log("Result:", g);
      setResult(g);
    }

    // Handlers for the draggable elements
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
  
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
      e.dataTransfer.effectAllowed = 'move';
      setDraggedItem(id);
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
  
      const allAvailableItems = [...importedAbi, ...customItems];
      const itemToAdd = allAvailableItems.find(item => item.id === draggedItem);
  
      if (!itemToAdd) return;
  
      const inputVariables: VariableInput[] = itemToAdd.inputs.map(input => ({
          name: input.name,
          type: input.type,
          value: ''  // Ensuring that variableInput is being set properly
      }));
      // @ts-ignore
      const newItem: Item = {
          ...itemToAdd,
          id: Date.now().toString(),
          inputVariables  // Add the initialized inputVariables to the new item
      };
  
      setItems(prev => [...prev, newItem]);
      setInputOptions(aggregateOutputMappings(items));
      setDraggedItem(null);
    };

    // Allow users to add a function to the stack without having to drag it around
    // Useful for large ABIs with multiple functions that will take up a lot of space
    const addToCanvas = (itemToAdd: Item) => {
      const inputVariables: VariableInput[] = itemToAdd.inputs.map(input => ({
        name: input.name,
        type: input.type,
        value: '' 
      }));
      // @ts-ignore
      const newItem: Item = {
          ...itemToAdd,
          id: Date.now().toString(),
          inputVariables 
      };
  
      setItems(prev => [...prev, newItem]);
      setInputOptions(aggregateOutputMappings(items));
    };

    useEffect(() => {
      console.log('Items state updated:', items);
    }, [items]);

  // Helper to update the underlying Item list
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
                value: value
            }));
        } else {
            inputValues.forEach((value, index) => {
                if (value === undefined) {
                    console.error('Value is undefined at index:', index);
                    return;
                } // @ts-ignore
                if (item.inputVariables[index]) { // @ts-ignore
                    item.inputVariables[index].value = value;
                }
            });
        }
        return updatedItems;
    });
  };

  const handleRemoveItem = (itemId: string) => {
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

  // Let's create some options for the drop down menu
  function aggregateOutputMappings(items: any[]): string[] {
    const allOutputMappings = new Set<string>();
  
    items.forEach(item => {
      const outputMappings = createOutputMappings(item.functionString, item.content);
      outputMappings.forEach(mapping => allOutputMappings.add(mapping));
    });

    Object.keys(state).forEach(key => allOutputMappings.add(key));
  
    return Array.from(allOutputMappings);
  }

    return (
      <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', height: '100vh' }}>
      <div style={{ width: '40%', padding: '20px', boxSizing: 'border-box' }}>

      {/* Drawer Toggle Button */}
      <button onClick={toggleDrawer} 
        style={{
          position: 'fixed', // Fixed position relative to the viewport
          top: '38%', // Distance from the bottom of the viewport
          right: '5%', // Distance from the right of the viewport
          padding: '10px',
          fontSize: '1em',
          backgroundColor: '#23424A', 
          color: 'white', // Text color
          border: 'none',
          borderRadius: '5px', // Rounded corners
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
          cursor: 'pointer',
          zIndex: 1000, // Ensure it's above other elements
        }}
      >
        {isDrawerOpen ? 'Close' : 'Menu'}
      </button>
  
      {/* Drawer */}
      <div style={{
        position: 'fixed',
        width: '30%',
        height: '100%',
        top: '0',
        left: isDrawerOpen ? '0' : '-100%',
        backgroundColor: '#FFFFFF',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.2)',
        transition: 'left 0.3s',
        zIndex: 1000,
        overflowY: 'auto',
        padding: '20px',
      }}>

        {/* VM Options */}
        <div 
          style={{
            position: 'absolute',
            top: '5%',
            right: '5%',
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
          <button 
            onClick={toggleDrawer}>
          {isDrawerOpen ? 'Close' : 'Menu'}
          </button>
        </div>
        <div style={{ marginTop: '10%', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', borderRadius: '5px'}}>
              <h2>VM Options</h2>
              <div style={{ borderRadius: '5px', padding: '10px' }}>
                  {customItems.map((item) => (
                      <DraggableAction key={item.id} id={item.id} content={item.content} inputs={item.inputs || []} onUpdateInputVariables={(inputValues) => handleUpdateInputVariables(item.id, inputValues)} onDragStart={handleDragStart} />
                  ))}
              </div>
          </div>
        
        {/* Contract Functions */}
        <div style={{ marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' , borderRadius: '5px'}}>
              <h2>Contract Functions</h2>
              <div style={{ borderRadius: '5px', padding: '10px' }}>
                  { importedAbi.map((item) => (
                      <DraggableAction key={item.id} id={item.id} content={item.content} inputs={item.inputs || []} onUpdateInputVariables={(inputValues) => handleUpdateInputVariables(item.id, inputValues)} onDragStart={handleDragStart} onAddToCanvas={() => addToCanvas(item)}/>
                  ))}
              </div>
        </div>
        
        {/* Custom Variables */}
        <div style={{ marginBottom: '30px' , boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          <h2>Custom Variables</h2>
              <div style={{borderRadius: '5px', padding: '10px' }}>
                 <StateVariables onAddVariable={handleAddVariable} state={state}></StateVariables>
              </div>
          </div>
          <div>

        {/* Upload ABI Button */}
        <div style={{ borderRadius: '5px', padding: '10px' }}>
              <button 
                onClick={() => setAbiModalOpen(true)} 
                style={{

                  position: 'fixed', // Fixed position relative to the viewport
                  bottom: '55%', // Distance from the bottom of the viewport
                  right: '5%', // Distance from the right of the viewport
                  padding: '10px',
                  fontSize: '1em',
                  backgroundColor: '#23424A', // Example background color
                  color: 'white', // Text color
                  border: 'none',
                  borderRadius: '5px', // Rounded corners
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                  cursor: 'pointer',
                  zIndex: 1000, // Ensure it's above other elements
                }}
              >
                Open ABI Modal
              </button>
              <AbiModal
                isOpen={isAbiModalOpen}
                onClose={() => setAbiModalOpen(false)}
                onAbiSubmit={handleAbiSubmit}
              />
              </div>
            </div>
          </div>
      </div>

      <div style={ isDrawerOpen ? { width: '50vw', padding: '40px', position: 'absolute', left:'30%'} : { width: '50vw', padding: '20px', position: 'absolute'}}>
          <h4>Drag and Drop</h4>
          <br/>
          <div 
              onDrop={handleCanvasDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{ 
                  minHeight: '100px', 
                  borderRadius: '5px',
                  padding: '20px',
                  backgroundColor: '#f9f9f9',
                  position: 'relative',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
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
            onRemove={() => handleRemoveItem(item.id)}
            options={inputOptions}
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
        <button 
          onClick={executeSequence} 
          style={{
            position: 'fixed', // Fixed position relative to the viewport
            bottom: '50%', // Distance from the bottom of the viewport
            right: '5%', // Distance from the right of the viewport
            padding: '10px',
            fontSize: '1em',
            backgroundColor: '#23424A', // Example background color
            color: 'white', // Text color
            border: 'none',
            borderRadius: '5px', // Rounded corners
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
            cursor: 'pointer',
            zIndex: 1000, // Ensure it's above other elements
          }}
        >
          Execute Sequence
        </button>

        <br></br>
        <div style={{overflow: 'visible', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginTop: '10px', background: 'white' }}>
          <ResultDisplay result={result} />
        </div>
      </div>
    </div>
    );
  };

export default PocCanvas;
