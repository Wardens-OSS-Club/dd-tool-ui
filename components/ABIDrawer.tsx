import { AppDrawer } from "./AppDrawer";
import StateVariables from "./StateVariables";
// components/PocCanvas.tsx
import DraggableAction from "./DraggableAction";
import { AppH3 } from "./AppTypography";

type ABIDrawerProps = {
  isDrawerOpen: boolean;
  closeDrawer: () => void;
  customItems: any[];
  handleUpdateInputVariables: (id: string, inputValues: any) => void;
  handleDragStart: (e: any, id: string) => void;
  importedAbi: any[];
  addToCanvas: (item: any) => void;
  handleAddVariable: (name: string, value: string) => void;
  state: any;
};

export const ABIDrawer = ({
  isDrawerOpen,
  closeDrawer,
  customItems,
  handleUpdateInputVariables,
  handleDragStart,
  importedAbi,
  addToCanvas,
  handleAddVariable,
  state,
}: ABIDrawerProps) => {
  return (
    <AppDrawer isOpen={isDrawerOpen} onClose={closeDrawer}>
      <AppH3 className="ml-1 mt-2">VM Options</AppH3>
      {customItems.map((item) => (
        <DraggableAction
          key={item.id}
          id={item.id}
          content={item.content}
          inputs={item.inputs || []}
          onUpdateInputVariables={(inputValues) =>
            handleUpdateInputVariables(item.id, inputValues)
          }
          onDragStart={handleDragStart}
        />
      ))}

      <AppH3 className="ml-1 mt-2">Contract Functions</AppH3>
      {importedAbi.map((item) => (
        <DraggableAction
          key={item.id}
          id={item.id}
          content={item.content}
          inputs={item.inputs || []}
          onUpdateInputVariables={(inputValues) =>
            handleUpdateInputVariables(item.id, inputValues)
          }
          onDragStart={handleDragStart}
          onAddToCanvas={() => addToCanvas(item)}
        />
      ))}
      <AppH3 className="ml-1 mt-2">Custom Variables</AppH3>
      <StateVariables onAddVariable={handleAddVariable} state={state} />
    </AppDrawer>
  );
};
