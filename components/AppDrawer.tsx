import React from "react";
import { IoMdClose } from "react-icons/io";
import { AppDefaultButton } from "./AppButton";
import c from "classnames";

interface AppDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  children,
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={c(
        "fixed top-0 z-10 left-0 w-[350px] h-full bg-gray-100 transform transition-transform duration-300 ease-in-out pt-4 pr-2 pb-2 pl-2 overflow-scroll",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        }
      )}
    >
      <AppDefaultButton onClick={onClose} className="absolute top-2 right-2">
        <IoMdClose />
      </AppDefaultButton>
      {children}
    </div>
  );
};
