import React, { useState } from "react";
import { AppInput } from "./AppInput";
import { AppButtonSuccess } from "./AppButton";
import { AppP } from "./AppTypography";

interface StateVariablesProps {
  onAddVariable: (name: string, value: string) => void;
  state: { [key: string]: string };
}

const StateVariables: React.FC<StateVariablesProps> = ({
  onAddVariable,
  state,
}) => {
  const [variableName, setVariableName] = useState("");
  const [variableValue, setVariableValue] = useState("");

  const handleAddVariable = () => {
    if (variableName && variableValue) {
      onAddVariable("#" + variableName, variableValue);
      setVariableName("");
      setVariableValue("");
    }
  };

  const renderStateVariables = () => {
    return Object.entries(state).map(([key, value]) => (
      <div
        key={key}
        className="bg-white mb-1 rounded-1 text-black p-2 rounded-[3px]"
      >
        <strong>{key}:</strong> {value}
      </div>
    ));
  };

  return (
    <div className="rounded-[5px] bg-[#E1EBEC] m-[4px] relative shadow-[0 2px 4px rgba(0,0,0,0.2)] relative p-5">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <AppInput
          label="Variable Name:"
          name=""
          value={variableName}
          className="bg-white"
          onChange={(e) => setVariableName(e.target.value)}
        />
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <AppInput
          label="Variable Value:"
          name=""
          value={variableValue}
          className="bg-white"
          onChange={(e) => setVariableValue(e.target.value)}
        />
      </div>

      <AppButtonSuccess onClick={handleAddVariable}>
        Add Variable
      </AppButtonSuccess>

      <div className="mt-[20px]">
        <AppP>State Variables</AppP>
        {renderStateVariables()}
      </div>
    </div>
  );
};

export default StateVariables;
