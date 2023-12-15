import { useBooleanState } from "@/hooks/useBooleanState";
import { runSequence } from "dd-tool-package";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { MOCK_CONTRACT } from "../mock/mock-contract";
import { parseAbiFunctions } from "../services/abi-service";
import { createOutputMappings } from "../services/helper-service";
import { ABIDrawer } from "./ABIDrawer";
import AbiModal from "./AbiModal";
import { AppDefaultButton } from "./AppButton";
import { AppCode } from "./AppCode";
import { AppH2, AppH4 } from "./AppTypography";
import DraggableAction from "./DraggableAction";
import ResultDisplay from "./ResultDisplay";
import { default as VariableInput } from "./StateVariables";
import { AppSpinner } from "./AppSpinner";

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
      value: null | string;
      gasLimit: null | string;
      from: string;
    };
    contract: {
      functionString: string;
      address: string;
    };
    inputs: any[];
  };
  outputMappings: string[];
  inputMappings: VariableInput[];
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
      functionString:
        "function getPricePerFullShare() external view returns (uint256)",
      address: "0xBA485b556399123261a5F9c95d413B4f93107407",
      inputs: [],
      inputVariables: [],
    },
  ]);

  // DD-tool requires state to be passed to it
  const [state, setState] = useState({});
  const [result, setResult] = useState([]);
  const [inputOptions, setInputOptions] = useState<any[]>([]);
  const [isDrawerOpen, { toggle: toggleDrawer, setFalse: closeDrawer }] =
    useBooleanState(false);
  const [loading, setLoading] = useState(false);

  // ABI importing and parsing
  const [importedAbi, setImportedAbi] = useState(MOCK_CONTRACT);
  const [isAbiModalOpen, { setTrue: openABIModal, setFalse: closeABIModal }] =
    useBooleanState(false);

  // Helper to add custom variable to state
  const handleAddVariable = (name: string, value: string) => {
    setState((prev) => ({ ...prev, [name]: value }));
    console.log("State in canvas: ", state);
  };

  // These are the VM custom instruction set
  // TODO: either add these to the dd-tool side, or create a file
  const customItems = [
    {
      id: "custom-1",
      content: "Prank",
      functionString: "INSERT the PRANK",
      inputs: [{ name: "Address", type: "address" }],
      inputVariables: [],
    },
    {
      id: "custom-2",
      content: "Deal",
      functionString: "INSERT the DEAL",
      inputs: [
        { name: "Target", type: "address" },
        { name: "Amount", type: "uint256" },
      ],
    },
    {
      id: "custom-3",
      content: "ExpectRevert",
      functionString: "INSERT the EXPECTREVERT",
      inputs: [],
    },
  ];

  // Setting up the external functions
  // This will usually be given by the json the dd-tool provides
  // This can be passed in from the dd-tool, but want to show more options for now

  // Accept and convert json abi to

  const handleAbiSubmit = (abi: string, targetAddress: string) => {
    try {
      const iface = new ethers.Interface(abi);
      const parsedValues: any[] = parseAbiFunctions(
        iface.format(true),
        iface,
        targetAddress
      );
      setImportedAbi(parsedValues);
      console.log(parsedValues);
    } catch (error) {
      console.error("Invalid ABI");
    }
  };

  // Helper to generate outputMappings

  // Because the items from the ABI != what we need for DD-tool
  // We convert with this utility
  const transformItems = (
    items: any[],
    state: { [key: string]: any }
  ): DDToolItem[] => {
    let prankCaller: string = "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8";
    return items
      .map((item) => {
        // Handle the prank
        if (item.content === "Prank") {
          prankCaller = item.inputVariables[0].value.slice(1);
          console.log("The prank is set: ", prankCaller);
          return null;
        }
        // Parsing the amount of elements in the `returns ()` statement
        // Then simply creating a state var
        const outputs = item.functionString.match(/returns \(([^)]+)\)/);
        let outputMappings = [];
        if (outputs && outputs[1]) {
          outputMappings = outputs[1]
            .split(",")
            .map(
              (_: string, index: number) => `${item.address.slice(0,6)}-${item.content}-var${index + 1}`
            );
        }

        return {
          call: {
            callInfo: {
              value: null,
              gasLimit: null,
              from: prankCaller,
            },
            contract: {
              functionString: item.functionString,
              address: item.address,
            },
            inputs: [], // Assuming inputs will be handled elsewhere or are not needed for this use case
          },
          outputMappings, // @ts-ignore
          inputMappings: item.inputVariables.map((inputVar) => {
            const isState = inputVar.value.startsWith("$");
            const isVar = inputVar.value.startsWith("#");
            const stateValue = isVar ? state[inputVar.value] : undefined;
            const directInput = state[inputVar.value] == undefined && !isVar;

            return {
              type:
                stateValue !== undefined
                  ? "concrete"
                  : stateValue
                  ? "state"
                  : "concrete",
              name: inputVar.name,
              value: directInput
                ? inputVar.value.slice(1)
                : stateValue !== undefined
                ? stateValue
                : isState
                ? inputVar.value.slice(1)
                : inputVar.value,
            };
          }),
        };
      })
      .filter((item) => item !== null);
  };

  // Let's run the DD tool
  // This function calls `runSequence` on the imported dd-tool
  const executeSequence = async () => {
    setLoading(true);
    const newItems: DDToolItem[] = transformItems(items, state);
    console.log("Transformed Item Stack", newItems);
    console.log("STATE IN CANVAS: ", state);
    console.log("Submitted Tx to dd-tool: ", newItems);
    const g = await runSequence(newItems, RPC_URL, { alwaysFundCaller: true });
    console.log("Result:", g);
    setResult(g);
    setLoading(false);
  };

  // Handlers for the draggable elements
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem(id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();

    if (!draggedItem) return;

    const draggedItemIndex = items.findIndex((item) => item.id === draggedItem);
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
    const itemToAdd = allAvailableItems.find((item) => item.id === draggedItem);

    if (!itemToAdd) return;

    const inputVariables: VariableInput[] = itemToAdd.inputs.map((input) => ({
      name: input.name,
      type: input.type,
      value: "", // Ensuring that variableInput is being set properly
    }));
    // @ts-ignore
    const newItem: Item = {
      ...itemToAdd,
      id: Date.now().toString(),
      inputVariables, // Add the initialized inputVariables to the new item
    };

    setItems((prev) => [...prev, newItem]);
    setInputOptions(aggregateOutputMappings(items));
    setDraggedItem(null);
  };

  // Allow users to add a function to the stack without having to drag it around
  // Useful for large ABIs with multiple functions that will take up a lot of space
  const addToCanvas = (itemToAdd: Item) => {
    const inputVariables: VariableInput[] = itemToAdd.inputs.map((input) => ({
      name: input.name,
      type: input.type,
      value: "",
    }));
    // @ts-ignore
    const newItem: Item = {
      ...itemToAdd,
      id: Date.now().toString(),
      inputVariables,
    };

    setItems((prev) => [...prev, newItem]);
    setInputOptions(aggregateOutputMappings(items));
  };

  useEffect(() => {
    console.log("Items state updated:", items);
  }, [items]);

  // Helper to update the underlying Item list
  const handleUpdateInputVariables = (
    itemId: string,
    inputValues: string[]
  ) => {
    console.log("handleUpdateInputVariables inputValues:", inputValues); // Log for debugging
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const item = updatedItems.find((item) => item.id === itemId);
      if (!item) return prevItems;

      if (!item.inputVariables || item.inputVariables.length === 0) {
        item.inputVariables = inputValues.map((value, index) => ({
          name: item.inputs[index].name,
          type: item.inputs[index].type,
          value: value,
        }));
      } else {
        inputValues.forEach((value, index) => {
          if (value === undefined) {
            console.error("Value is undefined at index:", index);
            return;
          } // @ts-ignore
          if (item.inputVariables[index]) {
            // @ts-ignore
            item.inputVariables[index].value = value;
          }
        });
      }
      return updatedItems;
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Let's create some options for the drop down menu
  function aggregateOutputMappings(items: any[]): string[] {
    const allOutputMappings = new Set<string>();

    items.forEach((item) => {
      const outputMappings = createOutputMappings(
        item.functionString,
        item.content
      );
      outputMappings.forEach((mapping) => allOutputMappings.add(mapping));
    });

    Object.keys(state).forEach((key) => allOutputMappings.add(key));

    return Array.from(allOutputMappings);
  }

  return (
    <>
      <div>
        <div className="flex gap-2">
          <AppDefaultButton onClick={toggleDrawer}>
            {isDrawerOpen ? "Close" : "Menu"}
          </AppDefaultButton>
          <AppDefaultButton onClick={openABIModal}>
            Open ABI Modal
          </AppDefaultButton>
          <AppDefaultButton
            onClick={executeSequence}
            disabled={loading}
            className="gap-2"
          >
            <span> Execute Sequence</span>

            {loading && <AppSpinner />}
          </AppDefaultButton>
        </div>

        <ABIDrawer
          {...{
            isDrawerOpen,
            closeDrawer,
            customItems,
            handleUpdateInputVariables,
            handleDragStart,
            importedAbi,
            addToCanvas,
            handleAddVariable,
            state,
          }}
        />

        <div className="pt-[20px] w-[1000px]">
          <AppH2 className="mb-2">Drag and Drop</AppH2>
          <div
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            className="min-h-[100px] rounder-[5px] p-5 bg-[#f9f9f9]"
            style={{
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                className=" p-2 mx-2 my-0 cursor-move border-[#ccc]"
              >
                <DraggableAction
                  id={item.id}
                  content={item.content}
                  inputs={item.inputs || []}
                  onUpdateInputVariables={(inputValues) =>
                    handleUpdateInputVariables(item.id, inputValues)
                  }
                  onDragStart={handleDragStart}
                  onRemove={() => handleRemoveItem(item.id)}
                  options={inputOptions}
                />
              </div>
            ))}
            <div
              style={{
                height: "100%",
                width: "100%",
                zIndex: items.length === 0 ? 1 : -1,
              }}
              onDrop={handleCanvasDrop}
              onDragOver={(e) => e.preventDefault()}
            />
          </div>
          <AppH2 className="mb-2 mt-4">Output</AppH2>

          <AppCode
            language="json"
            code={JSON.stringify(
              items.map(
                ({ functionString, address, inputs, inputVariables }) => ({
                  functionString,
                  address,
                  inputs,
                  inputVariables,
                })
              ),
              null,
              2
            )}
          />

          {Object.keys(result).length > 0 && (
            <div
              className="min-h-[100px] rounder-[5px] p-5 bg-[#f9f9f9] mt-5"
              style={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              <ResultDisplay result={result} />
            </div>
          )}
        </div>
      </div>
      <AbiModal
        isOpen={isAbiModalOpen}
        onClose={closeABIModal}
        onAbiSubmit={handleAbiSubmit}
      />
    </>
  );
};

export default PocCanvas;
