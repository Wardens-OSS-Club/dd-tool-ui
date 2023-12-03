import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { IoMdCloseCircle } from "react-icons/io";

type AppModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
};

export const AppModal = ({
  isOpen,
  onClose,
  children,
  title,
}: AppModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-layer-1/60 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 flex min-h-screen items-end justify-center overflow-hidden px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative inline-flex w-full transform flex-col overflow-hidden rounded-xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 sm:max-w-md sm:align-middle">
              <div className="absolute top-4 right-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex aspect-square cursor-pointer items-center justify-center rounded-xl border-none border-transparent bg-transparent p-2 font-semibold text-text hover:bg-heading/5 focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text child-svg:h-5 child-svg:w-5"
                >
                  <span className="sr-only">Close</span>
                  <IoMdCloseCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="flex h-16 flex-shrink-0 items-center justify-between px-6">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold  text-black"
                >
                  {title}
                </Dialog.Title>
              </div>
              <div className="px-6 pb-6">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
