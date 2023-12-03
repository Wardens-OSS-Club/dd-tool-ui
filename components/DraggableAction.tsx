import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AppButtonDanger, AppButtonSuccess } from "./AppButton";
import ComboBox from "./ComboBox";
import { AppCode } from "./AppCode";

interface DraggableActionProps {
  id: string;
  content: string;
  inputs: Array<{ name: string; type: string }>;
  onUpdateInputVariables?: (values: string[]) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onRemove?: () => void;
  onAddToCanvas?: () => void;
  options?: string[] | undefined;
}

const DraggableAction: React.FC<DraggableActionProps> = ({
  id,
  content,
  inputs,
  options,
  onDragStart,
  onRemove,
  onUpdateInputVariables,
  onAddToCanvas,
}) => {
  const [inputValues, setInputValues] = useState<string[]>(
    Array(inputs.length).fill("")
  );

  const handleInputChange = (index: number, value: string) => {
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = value;
    setInputValues(updatedInputValues);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      className="rounded-[5px] bg-[#E1EBEC] m-[4px] relative shadow-[0 2px 4px rgba(0,0,0,0.2)] relative p-5 cursor-move"
    >
      <AppCode code={content} language="solidity" />

      {inputs?.map((input, index) => (
        <div className="mt-2 flex flex-col" key={index}>
          <label className="text-black">{input.name}:</label>
          <ComboBox
            value={inputValues[index] || ""}
            onChange={(value) => handleInputChange(index, value)}
            onBlur={() => onUpdateInputVariables?.(inputValues)}
            options={options}
          />
        </div>
      ))}

      <div className="flex gap-2 pt-2">
        {onRemove && (
          <AppButtonDanger onClick={onRemove}>Remove</AppButtonDanger>
        )}
        {onAddToCanvas && (
          <AppButtonSuccess onClick={onAddToCanvas}>Add</AppButtonSuccess>
        )}
      </div>
    </div>
  );
};

export default DraggableAction;
