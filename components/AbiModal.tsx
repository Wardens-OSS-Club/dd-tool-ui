import React, { useState } from "react";
import { AppButtonCancel, AppDefaultButton } from "./AppButton";
import { AppInput } from "./AppInput";
import { AppTextArea } from "./AppTextArea";
import { AppModal } from "./AppModal";

// This is a simple component that accepts json abi

interface AbiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAbiSubmit: (abi: string, targetAddress: string) => void;
}

const AbiModal: React.FC<AbiModalProps> = ({
  isOpen,
  onClose,
  onAbiSubmit,
}) => {
  const [abiInput, setAbiInput] = useState("");
  const [addressInput, setAddressInput] = useState("");

  const handleSubmit = () => {
    onAbiSubmit(abiInput, addressInput);
    onClose();
  };

  return (
    <AppModal title="Enter Contract Details" {...{ isOpen, onClose }}>
      <AppInput
        label="Address"
        type="text"
        name="address"
        value={addressInput}
        onChange={(e) => setAddressInput(e.target.value)}
      />

      <AppTextArea
        label="ABI:"
        name="abi"
        value={abiInput}
        onChange={(e) => setAbiInput(e.target.value)}
        rows={10}
      />

      <div className="flex gap-2 mt-3">
        <AppDefaultButton onClick={handleSubmit}>Submit</AppDefaultButton>
        <AppButtonCancel onClick={onClose}>Cancel</AppButtonCancel>
      </div>
    </AppModal>
  );
};

export default AbiModal;
